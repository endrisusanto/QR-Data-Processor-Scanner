import React from 'react';
import { ItemData } from '../types';
import { GlassCard } from './GlassCard';
import { Icons } from './Icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: ItemData | null;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, item }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <GlassCard className="w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center border-b border-white/20 pb-3 mb-4">
            <h2 className="text-2xl font-bold text-white">Confirm Action</h2>
            <button onClick={onClose} className="text-white/70 hover:text-white transition">
              <Icons.Close />
            </button>
          </div>
          <div className="my-4 text-center">
            <p className="text-lg text-white/90">
              Are you sure you want to manually mark this item as scanned?
            </p>
            <p className="font-mono text-xl text-cyan-400 mt-2 bg-black/20 py-2 px-4 rounded-md inline-block">
              {item.serial}
            </p>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-bold rounded-lg transition duration-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-green-500/80 hover:bg-green-500/100 backdrop-blur-sm border border-white/20 text-white font-bold rounded-lg transition duration-300"
            >
              Confirm
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};