import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ItemData } from '../types';
import { GlassCard } from './GlassCard';
import { Icons } from './Icons';

interface SlideshowModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ItemData[];
}

export const SlideshowModal: React.FC<SlideshowModalProps> = ({ isOpen, onClose, items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [delay, setDelay] = useState(3);
  const [filterStatus, setFilterStatus] = useState<'all' | 'scanned' | 'not_scanned'>('all');
  // FIX: Use ReturnType<typeof setInterval> for browser compatibility instead of NodeJS.Timeout
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const filteredItems = items.filter(item => {
    if (filterStatus === 'scanned') return item.scanned;
    if (filterStatus === 'not_scanned') return !item.scanned;
    return true;
  });

  useEffect(() => {
    setCurrentIndex(0);
  }, [filterStatus]);

  const nextQr = useCallback(() => {
    if (filteredItems.length === 0) return;
    setCurrentIndex(prev => (prev + 1) % filteredItems.length);
  }, [filteredItems.length]);

  const prevQr = () => {
    if (filteredItems.length === 0) return;
    setCurrentIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  const startSlideshow = useCallback(() => {
    // Pastikan interval sebelumnya dibersihkan saat memulai yang baru
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(nextQr, delay * 1000);
  }, [nextQr, delay]);

  const stopSlideshow = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isOpen && isPlaying && filteredItems.length > 0) {
      startSlideshow();
    } else {
      stopSlideshow();
    }
    // Cleanup function: hentikan slideshow saat komponen di-unmount atau dependensi berubah
    return stopSlideshow;
  }, [isOpen, isPlaying, startSlideshow, filteredItems.length]);

  const handlePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const handleDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDelay(Number(e.target.value));
  };

  // Karena startSlideshow bergantung pada `delay`, kita perlu memanggilnya ulang saat delay berubah
  // tetapi hanya jika slideshow sedang diputar
  useEffect(() => {
    if (isPlaying && isOpen) {
      // Stop current slideshow interval and start a new one with the new delay
      stopSlideshow();
      startSlideshow();
    }
  }, [delay, isPlaying, isOpen]);


  const currentItem = filteredItems[currentIndex];

  if (!isOpen) return null;

  return (
    // PERUBAHAN: Hapus onClick={onClose} dari elemen backdrop ini
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-xl" onClick={e => e.stopPropagation()}>
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-center border-b border-white/20 pb-3 mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">QR Code Slideshow</h2>
            <button onClick={onClose} className="text-white/70 hover:text-white transition p-2 bg-white/10 rounded-full">
              <Icons.Close />
            </button>
          </div>

          <div className="flex justify-center space-x-2 mb-4">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${filterStatus === 'all' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('scanned')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${filterStatus === 'scanned' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
            >
              Scanned
            </button>
            <button
              onClick={() => setFilterStatus('not_scanned')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${filterStatus === 'not_scanned' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
            >
              Not Scanned
            </button>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4">
            {filteredItems.length > 0 ? (
              <>
                <div className="w-56 h-56 md:w-64 md:h-64 p-4 border-2 border-cyan-400 rounded-lg bg-white flex items-center justify-center shadow-inner">
                  {currentItem && <QRCodeSVG value={currentItem.serial} size={180} includeMargin={false} className="w-full h-full" />}
                </div>
                {currentItem && (
                  <div className="text-center px-2">
                    <p className="font-light text-white/80 text-sm md:text-base">({currentIndex + 1} of {filteredItems.length}) Model: <span className="font-medium">{currentItem.model}</span></p>
                    <p className="font-bold text-lg md:text-xl text-cyan-300 font-mono tracking-wider break-all">{currentItem.serial}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="w-64 h-64 flex items-center justify-center text-white/50 italic">
                No items match filter
              </div>
            )}
          </div>

          <div className="flex justify-center items-center space-x-4 mt-6">
            <button onClick={prevQr} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition duration-200">
              <Icons.ChevronLeft />
            </button>
            <button onClick={handlePlayPause} className="p-3 bg-cyan-500/80 hover:bg-cyan-500/100 text-white rounded-full transition duration-200 w-16 h-16 flex items-center justify-center shadow-lg">
              {isPlaying ? <Icons.Pause /> : <Icons.Play />}
            </button>
            <button onClick={nextQr} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition duration-200">
              <Icons.ChevronRight />
            </button>
          </div>



          {/* New horizontal checkbox delay selector */}
          <div className="mt-6 pt-4 border-t border-white/20">
            <label className="block text-sm font-medium text-white/80 mb-2">Slideshow Delay (seconds):</label>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(d => (
                <label key={d} className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={delay === d}
                    onChange={() => setDelay(d)}
                    className="h-4 w-4 text-cyan-500 bg-gray-700 border-gray-600 rounded"
                  />
                  <span className="text-sm text-white">{d}s</span>
                </label>
              ))}
            </div>
          </div>

        </div>
      </GlassCard>
    </div>
  );
};