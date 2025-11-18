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
  // FIX: Use ReturnType<typeof setInterval> for browser compatibility instead of NodeJS.Timeout
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextQr = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % items.length);
  }, [items.length]);

  const prevQr = () => {
    setCurrentIndex(prev => (prev - 1 + items.length) % items.length);
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
    if (isOpen && isPlaying && items.length > 0) {
      startSlideshow();
    } else {
      stopSlideshow();
    }
    // Cleanup function: hentikan slideshow saat komponen di-unmount atau dependensi berubah
    return stopSlideshow; 
  }, [isOpen, isPlaying, startSlideshow, items.length]);

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


  const currentItem = items[currentIndex];

  if (!isOpen) return null;

  return (
    // PERUBAHAN: Hapus onClick={onClose} dari elemen backdrop ini
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-xl" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center border-b border-white/20 pb-3 mb-4">
            <h2 className="text-2xl font-bold text-white">QR Code Slideshow</h2>
            <button onClick={onClose} className="text-white/70 hover:text-white transition">
                <Icons.Close />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-64 h-64 p-4 border-2 border-cyan-400 rounded-lg bg-white flex items-center justify-center shadow-inner">
                {currentItem && <QRCodeSVG value={currentItem.serial} size={220} includeMargin={false} />}
            </div>
            {currentItem && (
                 <div className="text-center">
                    <p className="font-light text-white/80">({currentIndex + 1} of {items.length}) Model: {currentItem.model}</p>
                    <p className="font-bold text-xl text-cyan-300 font-mono tracking-wider">{currentItem.serial}</p>
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

          <div className="mt-6 pt-4 border-t border-white/20">
            <label htmlFor="delay-input" className="block text-sm font-medium text-white/80 mb-2">Slideshow Delay (seconds):</label>
            <div className="flex items-center space-x-3">
              <input type="range" id="delay-input" min="1" max="10" value={delay} step="1" onChange={handleDelayChange} className="w-full h-2 bg-black/30 rounded-lg appearance-none cursor-pointer range-lg accent-cyan-400" />
              <span className="text-lg font-bold text-cyan-400 w-8 text-right">{delay}</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};