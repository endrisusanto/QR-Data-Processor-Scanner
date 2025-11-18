
import React, { useState, useCallback, useRef } from 'react';
import { ItemData, AlertData, AlertType } from './types';
import { GlassCard } from './components/GlassCard';
import { DataTable } from './components/DataTable';
import { ScannerModal } from './components/ScannerModal';
import { SlideshowModal } from './components/SlideshowModal';
import { AlertContainer } from './components/AlertContainer';
import { Accordion } from './components/Accordion';
import { Icons } from './components/Icons';

const App: React.FC = () => {
  const [items, setItems] = useState<ItemData[]>([]);
  const [dataInput, setDataInput] = useState<string>('Model Name\tSerial\nSM-A235F_CIS_SER\tVAH0422M\nSM-A236E_SEA_XME\tVEP0085M\nSM-A326B_SEA_XME\tUB30832M');
  const [isScannerModalOpen, setScannerModalOpen] = useState<boolean>(false);
  const [isSlideshowModalOpen, setSlideshowModalOpen] = useState<boolean>(false);
  const [isInputCollapsed, setIsInputCollapsed] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  
  const scannedSerialsRef = useRef<Set<string>>(new Set());

  const addAlert = useCallback((title: string, message: string, type: AlertType) => {
    const newAlert: AlertData = { id: Date.now(), title, message, type };
    setAlerts(prev => [newAlert, ...prev]);
  }, []);

  const processData = useCallback(() => {
    if (!dataInput.trim()) {
      addAlert('Input Kosong', 'Harap masukkan data tabel dari Excel.', 'error');
      return;
    }

    const lines = dataInput.trim().split('\n');
    if (lines.length <= 1) {
        addAlert('Data Tidak Valid', 'Tidak ada baris data untuk diproses.', 'error');
        return;
    }

    const dataRows = lines.slice(1);
    
    const newItems: ItemData[] = dataRows.map(line => {
      const parts = line.split('\t').map(p => p.trim());
      if (parts.length >= 2 && parts[0] && parts[1]) {
        return {
          model: parts[0],
          serial: parts[1],
          scanned: scannedSerialsRef.current.has(parts[1]),
        };
      }
      return null;
    }).filter((item): item is ItemData => item !== null);

    if (newItems.length === 0) {
      addAlert('Data Tidak Valid', 'Pastikan data yang ditempel memiliki format Model Name dan Serial yang benar.', 'error');
      return;
    }

    setItems(newItems);
    addAlert('Berhasil', `${newItems.length} item berhasil diproses.`, 'success');
    setIsInputCollapsed(true);
  }, [dataInput, addAlert]);

  const handleScanSuccess = useCallback((scannedSerial: string) => {
    if (scannedSerialsRef.current.has(scannedSerial)) {
      addAlert('Duplikasi Serial', `Serial ${scannedSerial} sudah pernah di-scan.`, 'info');
      return;
    }

    let itemFound = false;
    const updatedItems = items.map(item => {
      if (item.serial === scannedSerial) {
        itemFound = true;
        return { ...item, scanned: true };
      }
      return item;
    });

    if (itemFound) {
      setItems(updatedItems);
      scannedSerialsRef.current.add(scannedSerial);
      addAlert('Scan Berhasil', `Serial ${scannedSerial} ditemukan dan ditandai.`, 'success');
    } else {
      addAlert('Serial Tidak Ditemukan', `Serial ${scannedSerial} tidak ada dalam daftar.`, 'error');
    }
  }, [items, addAlert]);

  const scannedCount = items.filter(item => item.scanned).length;

  return (
    <div className="min-h-screen w-full p-4 md:p-8 flex flex-col items-center text-white font-sans">
      <AlertContainer alerts={alerts} setAlerts={setAlerts} />

      <header className="w-full max-w-7xl mx-auto text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-shadow">
          QR Data Processor & Scanner
        </h1>
        <p className="mt-2 text-lg text-white/80">Paste data, generate QR codes, and start scanning.</p>
      </header>

      <main className="w-full max-w-7xl mx-auto flex flex-col gap-6">
        <GlassCard>
            <Accordion
              title="Input Data"
              isCollapsed={isInputCollapsed}
              onToggle={() => setIsInputCollapsed(prev => !prev)}
            >
              <div className="px-6 pb-6">
                <label htmlFor="data-input" className="block text-lg font-semibold text-white mb-3">
                  Paste Spreadsheet Data Here
                </label>
                <textarea
                  id="data-input"
                  rows={8}
                  value={dataInput}
                  onChange={(e) => setDataInput(e.target.value)}
                  className="w-full p-4 border border-white/20 rounded-lg bg-black/20 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 font-mono text-sm placeholder-white/50 transition-all duration-300"
                  placeholder={'Model Name\tSerial\nSM-A022F\tTLQ1186M\nSM-A022G\tTLQ1187M'}
                />
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <button onClick={processData} className="flex-1 bg-cyan-500/80 hover:bg-cyan-500/100 backdrop-blur-sm border border-white/20 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                    <Icons.Play />
                    Execute & Generate Table
                  </button>
                  <button onClick={() => setDataInput('')} className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                    <Icons.Trash />
                    Clear Input
                  </button>
                </div>
              </div>
            </Accordion>
        </GlassCard>

        {items.length > 0 && (
          <GlassCard>
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <div className='flex items-center gap-2'>
                  <h2 className="text-2xl font-bold">Data Overview</h2>
                  <span className="text-sm font-medium bg-green-500/80 px-3 py-1 rounded-full">{scannedCount} / {items.length} Scanned</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setScannerModalOpen(true)} className="bg-red-500/80 hover:bg-red-500/100 backdrop-blur-sm border border-white/20 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 shadow-md flex items-center gap-2">
                    <Icons.Scan />
                    Scan QR
                  </button>
                  <button onClick={() => setSlideshowModalOpen(true)} className="bg-purple-500/80 hover:bg-purple-500/100 backdrop-blur-sm border border-white/20 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 shadow-md flex items-center gap-2">
                    <Icons.Slideshow />
                    QR Slideshow
                  </button>
                </div>
              </div>
              <DataTable items={items} />
            </div>
          </GlassCard>
        )}
      </main>
      
      {isScannerModalOpen && (
        <ScannerModal
          isOpen={isScannerModalOpen}
          onClose={() => setScannerModalOpen(false)}
          onScanSuccess={handleScanSuccess}
          items={items}
        />
      )}

      {isSlideshowModalOpen && items.length > 0 && (
        <SlideshowModal
          isOpen={isSlideshowModalOpen}
          onClose={() => setSlideshowModalOpen(false)}
          items={items}
        />
      )}
    </div>
  );
};

export default App;
