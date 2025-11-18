
import React, { useState, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ItemData } from '../types';
import { Icons } from './Icons';

interface DataTableProps {
  items: ItemData[];
}

export const DataTable: React.FC<DataTableProps> = ({ items }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter(
      item =>
        item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serial.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  return (
    <div className="w-full">
      <div className="relative mb-4">
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
        <table className="min-w-full divide-y divide-white/20">
          <thead className="bg-black/30 sticky top-0 backdrop-blur-sm">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white/80 uppercase tracking-wider">Model Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white/80 uppercase tracking-wider">Serial</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">QR Code</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filteredItems.map(item => (
              <tr
                key={item.serial}
                className={`transition-colors duration-300 ${item.scanned ? 'bg-green-500/30 hover:bg-green-500/40' : 'hover:bg-white/10'}`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{item.model}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80 font-mono">{item.serial}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="inline-block p-1 bg-white rounded-md shadow-md">
                    <QRCodeSVG value={item.serial} size={48} includeMargin={false} />
                  </div>
                </td>
              </tr>
            ))}
             {filteredItems.length === 0 && (
                <tr>
                    <td colSpan={3} className="text-center py-10 text-white/70">
                        No items match your search.
                    </td>
                </tr>
             )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
