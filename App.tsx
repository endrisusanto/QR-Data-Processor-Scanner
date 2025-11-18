import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ItemData, AlertData, AlertType } from './types';
import { GlassCard } from './components/GlassCard';
import { DataTable } from './components/DataTable';
import { ScannerModal } from './components/ScannerModal';
import { SlideshowModal } from './components/SlideshowModal';
import { AlertContainer } from './components/AlertContainer';
import { Accordion } from './components/Accordion';
import { ConfirmationModal } from './components/ConfirmationModal';
import { Icons } from './components/Icons';

const initialData = `Model Name	Serial
SM-A022F_SEA_XXV	TLQ1186M
SM-A022F_SEA_XXV	TLQ1187M
SM-A235F_CIS_SER	VAH0422M
SM-A235F_CIS_SER	VAH0809M
SM-A235F_CIS_SER	VBL0184M
SM-A236E_SEA_XME	VEP0085M
SM-A236E_SEA_XME	VFE1308M
SM-A236E_SEA_XME	VFU2688M
SM-A245F_MEA_MEA	VL11249M
SM-A245F_MEA_MEA	VL11290M
SM-A245F_MEA_MEA	VLN1984M
SM-A245F_MEA_MEA	WAH1750M
SM-A326BZKHTHL	TL71550S
SM-A326B_SEA_XME	UB30832M
SM-A336E_MEA_MEA	UKH4428M
SM-A336E_SEA_XXV	VA73142M
SM-A336E_SEA_XXV	VA73375M
SM-A346E_SEA_PHL	VKN2001M
SM-A346E_SEA_PHL	VLC1121M
SM-A346E_SEA_PHL	VLC1127M
SM-A346E_SEA_PHL	WA21136M
SM-A546E_SEA_TSE	VL52552M
SM-A546E_SEA_TSE	VL52660M
SM-A546E_SEA_TSE	VLJ2886M
SM-A546E_SEA_TSE	VLJ3111M
SM-F700F_EUR_XX	SK81733M
SM-F711B_EUR_XX	UEB1217M
SM-F711B_EUR_XX	UEC1289M
SM-F711B_EUR_XX	UED1129M
SM-F711B_EUR_XX	UED1133M
SM-F711B_EUR_XX	UED1142M
SM-F711B_EUR_XX	UED1147M
SM-F721BE_SEA_DX	TKQ2155R
SM-F721BE_SEA_DX	VE21041M
SM-F721BE_SEA_DX	VE21056M
SM-F721BE_SEA_DX	VE21069M
SM-F731BE_SEA_DX	WDA0436M
SM-F731BE_SEA_DX	WDA0448M
SM-F731BE_SEA_DX	WDA0467M
SM-F731BE_SEA_DX	WDA0507M
SM-F731BE_SEA_DX	WDA0509M
SM-F731BE_SEA_DX	WDA0518M
SM-F741BE_SEA_DX	XCM0333M
SM-F741BE_SEA_DX	XCM0336M
SM-F741BE_SEA_DX	XCM0357M
SM-F741BE_SEA_DX	XCR0418M
SM-F761BE_SEA_DX	YCV1032M
SM-F761BE_SEA_DX	YCV1040M
SM-F766BE_SEA_DX	YD11869M
SM-F766BE_SEA_DX	YD11908M
SM-F916B_EUR_XX	TFG3024M
SM-F916B_EUR_XX	TFG3111M
SM-F926B_EUR_XX	UEJ0966M
SM-F926B_EUR_XX	UEJ0985M
SM-F926B_EUR_XX	UEJ1021M
SM-F926B_EUR_XX	UEJ1023M
SM-F926B_EUR_XX	UEJ1144M
SM-F926B_EUR_XX	UEJ1155M
SM-F936BE_SEA_DX	VEB0112M
SM-F936BE_SEA_DX	VEB0211M
SM-F936BE_SEA_DX	VEB0297M
SM-F936BE_SEA_DX	VEB0299M
SM-F946BE_SEA_DX	WEP0070M
SM-F946BE_SEA_DX	WEP0116M
SM-F946B_EUR_XX	UGD1867R
SM-F946B_EUR_XX	UGD1877R
SM-F946B_EUR_XX	WCK0171M
SM-F946B_EUR_XX	WCK0191M
SM-F946B_EUR_XX	WDJ0412M
SM-F946B_EUR_XX	WDJ1001M
SM-F956BE_SEA_DX	XD10713M
SM-F956BE_SEA_DX	XD10716M
SM-F956BE_SEA_DX	XD10719M
SM-F956BE_SEA_DX	XD10728M
SM-F956BE_SEA_DX	XD10741M
SM-F966BE_SEA_DX	YCQ0093M
SM-F966BE_SEA_DX	YCQ0239M
SM-G525F_EUR_XX	TL80374M
SM-G525F_EUR_XX	UAJ0731M
SM-G780F_CIS_SER	TH71663M
SM-G780G_SEA_XME	UC90916M
SM-G780G_SEA_XME	UC90947M
SM-G980F_EUR_XX	HB34096M
SM-G980F_EUR_XX	SKI0569H
SM-G985F_EUR_XX	SKC0652H
SM-G985F_EUR_XX	SKC0659H
SM-G985F_EUR_XX	SLB0437M
SM-G988B_EUR_XX	SKP0665H
SM-G988B_EUR_XX	SLS0139M
SM-G990E_SEA_XME	UHV1314M
SM-G990E_SEA_XME	UIH0645M
SM-G991B_EUR_XX	TJF0681H
SM-G991B_EUR_XX	TJJ0365H
SM-G996B_EUR_XX	TJH0114H
SM-G996B_EUR_XX	TJH0180H
SM-G998B_EUR_XX	TIO0860H
SM-G998B_EUR_XX	TIO0980H
SM-N980F_EUR_XX	TF80391H
SM-N980F_EUR_XX	TFP1123M
SM-N985F_EUR_XX	TE90269H
SM-N985F_EUR_XX	TE90337H
SM-N986BR_MEA_XSG	TGL0158M
SM-N986BR_MEA_XSG	TGL0163M
SM-S711BE_SEA_TSE	WFQ0582M
SM-S711BE_SEA_TSE	WFQ0585M
SM-S711BE_SEA_TSE	WFU4106M
SM-S711BE_SEA_TSE	WFU4118M
SM-S711BE_SEA_TSE	WH80265M
SM-S711BE_SEA_TSE	WH80268M
SM-S721BE_SEA_XME	XFL0227M
SM-S721BE_SEA_XME	XFL0237M
SM-S721BE_SEA_XME	XGQ1304M
SM-S731B_EUR_XX	YFD1584M
SM-S731B_EUR_XX	YFD1587M
SM-S901E_SEA_DX	UJ82395M
SM-S901E_SEA_DX	UJ82418M
SM-S901E_SEA_DX	UJ82474M
SM-S906E_SEA_DX	UJE1228M
SM-S906E_SEA_DX	UJE1230M
SM-S906E_SEA_DX	UJE1232M
SM-S908E_SEA_DX	UJC1241M
SM-S908E_SEA_DX	UJC1242M
SM-S908E_SEA_DX	UJC1269M
SM-S911B_EUR_XX	VIQ2953M
SM-S911B_EUR_XX	VIQ2980M
SM-S911B_EUR_XX	VIQ3009M
SM-S911B_EUR_XX	VIQ3025M
SM-S911B_EUR_XX	VIQ3034M
SM-S916B_EUR_XX	VJD3167M
SM-S916B_EUR_XX	VJD3170M
SM-S916B_EUR_XX	VJD3198M
SM-S916B_EUR_XX	VJD3215M
SM-S916B_EUR_XX	VJD3220M
SM-S916B_EUR_XX	VJD3265M
SM-S918B_EUR_XX	VIS6156M
SM-S918B_EUR_XX	VIS6170M
SM-S918B_EUR_XX	VIS6173M
SM-S918B_EUR_XX	VIS6195M
SM-S918B_EUR_XX	VIT1231M
SM-S918B_EUR_XX	VIT1269M
SM-S921BE_SEA_DX	WIM2674M
SM-S921BE_SEA_DX	WIM2700M
SM-S921BE_SEA_DX	WIM2704M
SM-S921BE_SEA_DX	WIM2707M
SM-S921BE_SEA_DX	WIM2753M
SM-S921BE_SEA_DX	WIM2763M
SM-S926BE_SEA_DX	WJI2394M
SM-S926BE_SEA_DX	WJI2427M
SM-S926BE_SEA_DX	WJI2435M
SM-S926BE_SEA_DX	WJI2449M
SM-S926BE_SEA_DX	WJI2453M
SM-S928BE_SEA_DX	WJD3584M
SM-S928BE_SEA_DX	WJD3587M
SM-S928BE_SEA_DX	WJD3589M
SM-S928BE_SEA_DX	WJD3590M
SM-S928BE_SEA_DX	WJD3592M
SM-S928BE_SEA_DX	WJD3602M
SM-S931BE_SEA_DX	XJ90644M
SM-S931BE_SEA_DX	XJA1408M
SM-S931BE_SEA_DX	XJA1436M
SM-S936BE_SEA_DX	XIU0644M
SM-S936BE_SEA_DX	XIU0660M
SM-S936BE_SEA_DX	XJ20522M
SM-S937BE_SEA_DX	YAL1615M
SM-S937BE_SEA_DX	YAL1625M
SM-S938BE_SEA_DX	XIA0049M
SM-S938BE_SEA_DX	XIJ2154M
SM-S938BE_SEA_DX	XIJ2160M`;

type FilterStatus = 'all' | 'scanned' | 'unscanned';

const App: React.FC = () => {
  const [dataInput, setDataInput] = useState<string>(() => {
    return localStorage.getItem('qrAppDataInput') || initialData;
  });

  const [items, setItems] = useState<ItemData[]>(() => {
    try {
      const savedItems = localStorage.getItem('qrAppItems');
      return savedItems ? JSON.parse(savedItems) : [];
    } catch (e) {
      return [];
    }
  });

  const scannedSerialsRef = useRef<Set<string>>(new Set(
    items.filter(i => i.scanned).map(i => i.serial)
  ));
  
  const [alert, setAlert] = useState<AlertData | null>(null);

  const [isInputCollapsed, setIsInputCollapsed] = useState<boolean>(() => {
    try {
      const savedItems = localStorage.getItem('qrAppItems');
      return savedItems ? JSON.parse(savedItems).length > 0 : false;
    } catch (e) {
      return false;
    }
  });

  const [isScannerModalOpen, setScannerModalOpen] = useState<boolean>(false);
  const [isSlideshowModalOpen, setSlideshowModalOpen] = useState<boolean>(false);
  const [confirmModalState, setConfirmModalState] = useState<{ isOpen: boolean; item: ItemData | null }>({ isOpen: false, item: null });
  const [filter, setFilter] = useState<FilterStatus>('all');

  useEffect(() => {
    try {
      localStorage.setItem('qrAppDataInput', dataInput);
      localStorage.setItem('qrAppItems', JSON.stringify(items));
      const scannedSerials = items.filter(item => item.scanned).map(item => item.serial);
      localStorage.setItem('qrAppScannedSerials', JSON.stringify(scannedSerials));
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
      addAlert('Storage Error', 'Could not save data. Your browser might be in private mode or storage is full.', 'error');
    }
  }, [dataInput, items]);
  
  const addAlert = useCallback((title: string, message: string, type: AlertType) => {
    setAlert({ id: Date.now(), title, message, type });
  }, []);

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
    reader.onerror = () => {
      addAlert('File Read Error', `Failed to read the file ${file.name}.`, 'error');
    };
    reader.readAsText(file);
    event.target.value = '';
  };

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
    
    // Reset scanned serials on new data processing, but keep the ref for continuity if needed
    scannedSerialsRef.current.clear();
    const dataRows = lines.slice(1);
    
    const newItems: ItemData[] = dataRows.map(line => {
      const parts = line.split('\t').map(p => p.trim());
      if (parts.length >= 2 && parts[0] && parts[1]) {
        return { model: parts[0], serial: parts[1], scanned: false };
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
    setItems(currentItems => {
        let itemFound = false;
        let alreadyScanned = false;
        const updatedItems = currentItems.map(item => {
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
            return currentItems;
        }

        if (itemFound) {
          scannedSerialsRef.current.add(scannedSerial);
          addAlert('Scan Berhasil', `Serial ${scannedSerial} ditemukan dan ditandai.`, 'success');
          return updatedItems;
        } else {
          addAlert('Serial Tidak Ditemukan', `Serial ${scannedSerial} tidak ada dalam daftar.`, 'error');
          return currentItems;
        }
    });
  }, [addAlert]);
  
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
      scannedSerialsRef.current.clear();
      localStorage.removeItem('qrAppDataInput');
      localStorage.removeItem('qrAppItems');
      localStorage.removeItem('qrAppScannedSerials');
      addAlert('Data Cleared', 'Input and table data have been cleared.', 'info');
  };

  const scannedCount = items.filter(item => item.scanned).length;
  
  const FilterButton: React.FC<{
    status: FilterStatus;
    label: string;
  }> = ({ status, label }) => (
    <button
      onClick={() => setFilter(status)}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 border border-white/20 backdrop-blur-sm ${
        filter === status
          ? 'bg-cyan-500/80 text-white shadow-lg'
          : 'bg-white/10 text-white/70 hover:bg-white/20'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen w-full p-4 md:p-8 flex flex-col items-center text-white font-sans">
      <AlertContainer alert={alert} setAlert={setAlert} />

      <header className="w-full max-w-7xl mx-auto text-center mb-8 no-print">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-shadow">
          QR Data Processor & Scanner
        </h1>
        <p className="mt-2 text-lg text-white/80">Paste data, generate QR codes, and start scanning.</p>
      </header>

      <main className="w-full max-w-7xl mx-auto flex flex-col gap-6">
        <GlassCard className="no-print">
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
                <div className="flex flex-col sm:grid sm:grid-cols-3 gap-4 mt-4">
                  <label className="cursor-pointer bg-blue-500/80 hover:bg-blue-500/100 backdrop-blur-sm border border-white/20 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                      <Icons.Upload />
                      <span>Upload .txt</span>
                      <input type="file" accept=".txt, text/plain" className="hidden" onChange={handleFileChange} />
                  </label>
                  <button onClick={processData} className="bg-cyan-500/80 hover:bg-cyan-500/100 backdrop-blur-sm border border-white/20 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                    <Icons.Play />
                    Execute & Generate
                  </button>
                  <button onClick={clearData} className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                    <Icons.Trash />
                    Clear Input
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
                  <button onClick={() => setScannerModalOpen(true)} className="bg-red-500/80 hover:bg-red-500/100 backdrop-blur-sm border border-white/20 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 shadow-md flex items-center gap-2">
                    <Icons.Scan />
                    Scan QR
                  </button>
                  <button onClick={() => setSlideshowModalOpen(true)} className="bg-purple-500/80 hover:bg-purple-500/100 backdrop-blur-sm border border-white/20 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 shadow-md flex items-center gap-2">
                    <Icons.Slideshow />
                    QR Slideshow
                  </button>
                   <button onClick={() => window.print()} className="bg-green-500/80 hover:bg-green-500/100 backdrop-blur-sm border border-white/20 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 shadow-md flex items-center gap-2">
                    <Icons.Print />
                    Print A4
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
        <ScannerModal
          isOpen={isScannerModalOpen}
          onClose={() => setScannerModalOpen(false)}
          onScanSuccess={handleScanSuccess}
          items={items}
        />
      )}
      
      {confirmModalState.isOpen && (
        <ConfirmationModal
            isOpen={confirmModalState.isOpen}
            onClose={() => setConfirmModalState({ isOpen: false, item: null })}
            onConfirm={handleConfirmManualCheck}
            item={confirmModalState.item}
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