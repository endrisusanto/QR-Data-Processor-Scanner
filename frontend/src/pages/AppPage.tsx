import React, { useState, useCallback, useEffect, useContext } from 'react';
import { ItemData, AlertData, AlertType } from '../types';
import { GlassCard } from '../components/GlassCard';
import { DataTable } from '../components/DataTable';
import { ScannerModal } from '../components/ScannerModal';
import { SlideshowModal } from '../components/SlideshowModal';
import { AlertContainer } from '../components/AlertContainer';
import { Accordion } from '../components/Accordion';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Icons } from '../components/Icons';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

type FilterStatus = 'all' | 'scanned' | 'unscanned';

const AppPage: React.FC = () => {
  const [dataInput, setDataInput] = useState<string>('');
  const [items, setItems] = useState<ItemData[]>([]);
  const [alert, setAlert] = useState<AlertData | null>(null);
  const [isInputCollapsed, setIsInputCollapsed] = useState<boolean>(false);
  const [isScannerModalOpen, setScannerModalOpen] = useState<boolean>(false);
  const [isSlideshowModalOpen, setSlideshowModalOpen] = useState<boolean>(false);
  const [confirmModalState, setConfirmModalState] = useState<{ isOpen: boolean; item: ItemData | null }>({ isOpen: false, item: null });
  const [filter, setFilter] = useState<FilterStatus>('all');
  const { logout } = useContext(AuthContext);

  const addAlert = useCallback((title: string, message: string, type: AlertType) => {
    setAlert({ id: Date.now(), title, message, type });
  }, []);
  
  const saveData = useCallback(async (newItems: ItemData[], newTextInput: string) => {
      try {
        await api.post('/data', { items: newItems, dataInput: newTextInput });
      } catch (error) {
          addAlert('Save Error', 'Could not save data to the server.', 'error');
          console.error(error);
      }
  }, [addAlert]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/data');
        setItems(res.data.items || []);
        setDataInput(res.data.dataInput || '');
        if (res.data.items && res.data.items.length > 0) {
            setIsInputCollapsed(true);
        }
      } catch (error) {
        addAlert('Fetch Error', 'Could not load data from the server.', 'error');
        console.error(error);
      }
    };
    fetchData();
  }, [addAlert]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== 'text/plain') {
      addAlert('Invalid File Type', 'Please upload a .txt file.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        setDataInput(text);
        addAlert('File Loaded', `Successfully loaded data from ${file.name}.`, 'success');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const processData = useCallback(() => {
    if (!dataInput.trim()) {
      addAlert('Input Kosong', 'Harap masukkan data.', 'error');
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
        return { model: parts[0], serial: parts[1], scanned: false };
      }
      return null;
    }).filter((item): item is ItemData => item !== null);

    if (newItems.length === 0) {
      addAlert('Data Tidak Valid', 'Pastikan format data benar.', 'error');
      return;
    }
    setItems(newItems);
    saveData(newItems, dataInput);
    addAlert('Berhasil', `${newItems.length} item berhasil diproses.`, 'success');
    setIsInputCollapsed(true);
  }, [dataInput, addAlert, saveData]);
  
  const updateItems = (updatedItems: ItemData[]) => {
      setItems(updatedItems);
      saveData(updatedItems, dataInput);
  }

  const handleScanSuccess = useCallback((scannedSerial: string) => {
    let itemFound = false;
    let alreadyScanned = false;
    const updatedItems = items.map(item => {
      if (item.serial === scannedSerial) {
        itemFound = true;
        if (item.scanned) {
            alreadyScanned = true;
        }
        return { ...item, scanned: true };
      }
      return item;
    });

    if (alreadyScanned) {
        addAlert('Duplikasi Serial', `Serial ${scannedSerial} sudah pernah di-scan.`, 'info');
        return;
    }
    if (itemFound) {
      updateItems(updatedItems);
      addAlert('Scan Berhasil', `Serial ${scannedSerial} ditemukan dan ditandai.`, 'success');
    } else {
      addAlert('Serial Tidak Ditemukan', `Serial ${scannedSerial} tidak ada dalam daftar.`, 'error');
    }
  }, [items, addAlert, updateItems]);
  
  const handleManualCheck = (item: ItemData) => {
    if (!item.scanned) {
        setConfirmModalState({ isOpen: true, item: item });
    }
  };

  const handleConfirmManualCheck = () => {
    if (confirmModalState.item) {
        handleScanSuccess(confirmModalState.item.serial);
    }
    setConfirmModalState({ isOpen: false, item: null });
  };
  
  const clearData = () => {
      setDataInput('');
      setItems([]);
      saveData([], '');
      addAlert('Data Cleared', 'Input and table data have been cleared.', 'info');
  };

  const scannedCount = items.filter(item => item.scanned).length;
  
  const FilterButton: React.FC<{ status: FilterStatus; label: string; }> = ({ status, label }) => (
    <button
      onClick={() => setFilter(status)}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 border border-white/20 backdrop-blur-sm ${
        filter === status ? 'bg-cyan-500/80 text-white shadow-lg' : 'bg-white/10 text-white/70 hover:bg-white/20'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen w-full p-4 md:p-8 flex flex-col items-center text-white font-sans">
      <AlertContainer alert={alert} setAlert={setAlert} />

      <header className="w-full max-w-7xl mx-auto text-center mb-8 no-print">
        <div className="flex justify-between items-center">
            <div></div> {/* Spacer */}
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-shadow">
            QR Data Processor & Scanner
            </h1>
            <button onClick={logout} className="bg-red-500/80 hover:bg-red-500/100 text-white font-bold py-2 px-4 rounded-lg">Logout</button>
        </div>
        <p className="mt-2 text-lg text-white/80">Paste data, generate QR codes, and start scanning.</p>
      </header>

      <main className="w-full max-w-7xl mx-auto flex flex-col gap-6">
        <GlassCard className="no-print">
            <Accordion title="Input Data" isCollapsed={isInputCollapsed} onToggle={() => setIsInputCollapsed(prev => !prev)}>
              <div className="px-6 pb-6">
                <textarea
                  rows={8} value={dataInput} onChange={(e) => setDataInput(e.target.value)}
                  className="w-full p-4 border border-white/20 rounded-lg bg-black/20 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 font-mono text-sm placeholder-white/50"
                  placeholder={'Model Name\tSerial\nSM-A022F\tTLQ1186M'}
                />
                <div className="flex flex-col sm:grid sm:grid-cols-3 gap-4 mt-4">
                  <label className="cursor-pointer bg-blue-500/80 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                      <Icons.Upload /><span>Upload .txt</span>
                      <input type="file" accept=".txt, text/plain" className="hidden" onChange={handleFileChange} />
                  </label>
                  <button onClick={processData} className="bg-cyan-500/80 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                    <Icons.Play />Execute & Generate
                  </button>
                  <button onClick={clearData} className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                    <Icons.Trash />Clear Input
                  </button>
                </div>
              </div>
            </Accordion>
        </GlassCard>

        {items.length > 0 && (
          <GlassCard className="printable-area">
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4 no-print">
                <div className='flex items-center gap-2'>
                  <h2 className="text-2xl font-bold">Data Overview</h2>
                  <span className="text-sm font-medium bg-green-500/80 px-3 py-1 rounded-full">{scannedCount} / {items.length} Scanned</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setScannerModalOpen(true)} className="bg-red-500/80 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center gap-2">
                    <Icons.Scan />Scan QR
                  </button>
                  <button onClick={() => setSlideshowModalOpen(true)} className="bg-purple-500/80 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center gap-2">
                    <Icons.Slideshow />QR Slideshow
                  </button>
                   <button onClick={() => window.print()} className="bg-green-500/80 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center gap-2">
                    <Icons.Print />Print A4
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4 no-print">
                  <FilterButton status="all" label="All" />
                  <FilterButton status="scanned" label="Scanned" />
                  <FilterButton status="unscanned" label="Not Scanned" />
              </div>
              <DataTable items={items} filter={filter} onManualCheck={handleManualCheck} />
            </div>
          </GlassCard>
        )}
      </main>
      
      {isScannerModalOpen && (
        <ScannerModal isOpen={isScannerModalOpen} onClose={() => setScannerModalOpen(false)} onScanSuccess={handleScanSuccess} items={items} />
      )}
      
      {confirmModalState.isOpen && (
        <ConfirmationModal isOpen={confirmModalState.isOpen} onClose={() => setConfirmModalState({ isOpen: false, item: null })} onConfirm={handleConfirmManualCheck} item={confirmModalState.item} />
      )}

      {isSlideshowModalOpen && items.length > 0 && (
        <SlideshowModal isOpen={isSlideshowModalOpen} onClose={() => setSlideshowModalOpen(false)} items={items} />
      )}
    </div>
  );
};

export default AppPage;
