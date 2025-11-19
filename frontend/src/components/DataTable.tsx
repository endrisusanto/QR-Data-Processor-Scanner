
import React, { useState, useMemo, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ItemData } from '../types';
import { Icons } from './Icons';

interface DataTableProps {
  items: ItemData[];
  filter: 'all' | 'scanned' | 'unscanned';
  onManualCheck: (item: ItemData) => void;
}

export const DataTable: React.FC<DataTableProps> = ({ items, filter, onManualCheck }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedModels, setExpandedModels] = useState<Set<string>>(new Set());

  const groupedItems = useMemo(() => {
    const statusFiltered = items.filter(item => {
      if (filter === 'scanned') return item.scanned;
      if (filter === 'unscanned') return !item.scanned;
      return true; // 'all'
    });

    const searchFiltered = searchTerm
      ? statusFiltered.filter(
          item =>
            item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.serial.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : statusFiltered;

    // FIX: Explicitly type the initial value of the reduce function to ensure that `groupedItems` is correctly typed.
    return searchFiltered.reduce((acc, item) => {
      (acc[item.model] = acc[item.model] || []).push(item);
      return acc;
    }, {} as Record<string, ItemData[]>);

  }, [items, searchTerm, filter]);

  useEffect(() => {
    if (searchTerm) {
      setExpandedModels(new Set(Object.keys(groupedItems)));
    }
  }, [searchTerm, groupedItems]);

  const toggleModel = (model: string) => {
    setExpandedModels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(model)) {
        newSet.delete(model);
      } else {
        newSet.add(model);
      }
      return newSet;
    });
  };

  return (
    <div className="w-full">
      <div className="relative mb-4 no-print">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search Model or Serial..."
          className="w-full p-3 pl-10 border border-white/20 rounded-lg bg-black/20 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 font-sans text-sm placeholder-white/50 transition-all duration-300"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Icons.Search />
        </div>
      </div>
      <div className="overflow-x-auto max-h-[60vh] rounded-lg border border-white/20">
        <table className="min-w-full">
          <thead className="bg-black/30 sticky top-0 backdrop-blur-sm z-10">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white/80 uppercase tracking-wider">Model Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white/80 uppercase tracking-wider">Serial</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">QR Code</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">Manual Audit</th>
            </tr>
          </thead>
          {Object.keys(groupedItems).length > 0 ? (
            Object.entries(groupedItems).map(([model, modelItems]) => {
              const isExpanded = expandedModels.has(model);
              const scannedInGroup = modelItems.filter(i => i.scanned).length;
              return (
                <tbody key={model} className="border-t border-white/20">
                  <tr onClick={() => toggleModel(model)} className="cursor-pointer bg-black/20 hover:bg-black/40 transition-colors">
                    <td className="px-6 py-3 font-bold text-white flex items-center gap-3">
                      <Icons.ChevronRight className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                      {model}
                    </td>
                    <td className="px-6 py-3 text-sm text-white/70 text-right" colSpan={3}>
                      <span className="bg-green-500/30 text-green-300 px-2 py-1 rounded-md text-xs">{scannedInGroup}</span> / {modelItems.length} items
                    </td>
                  </tr>
                  {modelItems.map(item => (
                    <tr
                      key={item.serial}
                      className={`transition-colors duration-300 printable-row ${
                        isExpanded ? '' : 'hidden'
                      } ${item.scanned ? 'bg-green-500/10' : 'bg-transparent hover:bg-white/10'}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {/* Empty cell under Model Name for hierarchy */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80 font-mono">{item.serial}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="inline-block p-1 bg-white rounded-md shadow-md qr-print-container">
                          <QRCodeSVG value={item.serial} size={48} includeMargin={false} />
                        </div>
                      </td>
                       <td className="px-6 py-4 whitespace-nowrap text-center">
                        <input
                          type="checkbox"
                          checked={item.scanned}
                          onChange={() => onManualCheck(item)}
                          className="w-5 h-5 rounded bg-white/20 border-white/30 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              );
            })
          ) : (
            <tbody>
              <tr>
                <td colSpan={4} className="text-center py-10 text-white/70">
                  No items match your search or filter.
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};
