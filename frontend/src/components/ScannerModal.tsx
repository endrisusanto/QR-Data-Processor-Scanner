import React, { useEffect, useRef, useMemo } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { ItemData } from '../types';
import { GlassCard } from './GlassCard';
import { Icons } from './Icons';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
  items: ItemData[];
}

export const ScannerModal: React.FC<ScannerModalProps> = ({ isOpen, onClose, onScanSuccess, items }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerId = "qr-reader";

  useEffect(() => {
    if (isOpen) {
      const scanner = new Html5Qrcode(readerId);
      scannerRef.current = scanner;
      
      const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
      };

      scanner.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          onScanSuccess(decodedText);
        },
        undefined
      ).catch(err => {
        console.error("Scanner start error", err);
        // Fallback for cameras that don't support environment facing mode
        if (err.name === "NotAllowedError" || err.name === "NotFoundError") {
            scanner.start(
                undefined, // Use default camera
                config,
                onScanSuccess,
                undefined
            ).catch(err2 => console.error("Fallback scanner start error", err2));
        }
      });
    }

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => console.error("Failed to stop scanner on cleanup", err));
      }
    };
  }, [isOpen, onScanSuccess]);

  const { scanned, total, unscanned } = useMemo(() => {
    const total = items.length;
    const scanned = items.filter(item => item.scanned).length;
    return { scanned, total, unscanned: total - scanned };
  }, [items]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" >
      <GlassCard className="w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center border-b border-white/20 pb-3 mb-4">
            <h2 className="text-2xl font-bold text-white">Scan QR Code</h2>
            <button onClick={onClose} className="text-white/70 hover:text-white transition">
              <Icons.Close />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-black/50 rounded-lg overflow-hidden border border-white/20 aspect-square">
                <div id={readerId} className="w-full h-full"></div>
            </div>

            <div className="bg-black/20 p-4 rounded-lg border border-white/10 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold mb-3 text-white">Scan Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-semibold text-white/90">
                    <span>Total Serials:</span>
                    <span className="text-cyan-400">{total}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-semibold text-white/90">
                    <span>Scanned:</span>
                    <span className="text-green-400">{scanned}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-semibold text-white/90">
                    <span>Remaining:</span>
                    <span className="text-red-400">{unscanned}</span>
                  </div>
                </div>
                <p className="text-xs text-white/50 mt-4">Point your camera at a QR code. The item will be marked as scanned in the table.</p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
