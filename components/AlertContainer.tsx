
import React, { useEffect } from 'react';
import { AlertData, AlertType } from '../types';
import { Icons } from './Icons';

interface AlertProps {
  alert: AlertData;
  onDismiss: (id: number) => void;
}

const Alert: React.FC<AlertProps> = ({ alert, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss(alert.id);
        }, 5000);
        return () => clearTimeout(timer);
    }, [alert.id, onDismiss]);

    // FIX: Replaced JSX.Element with React.ReactElement to resolve namespace issue.
    const alertStyles: { [key in AlertType]: { bg: string, border: string, icon: React.ReactElement } } = {
        success: { bg: 'bg-green-500/20', border: 'border-green-400', icon: <Icons.CheckCircle /> },
        error: { bg: 'bg-red-500/20', border: 'border-red-400', icon: <Icons.ExclamationCircle /> },
        info: { bg: 'bg-blue-500/20', border: 'border-blue-400', icon: <Icons.InfoCircle /> },
    };

    const styles = alertStyles[alert.type];

    return (
        <div className={`w-full max-w-sm p-4 rounded-xl border ${styles.bg} ${styles.border} backdrop-blur-xl shadow-lg flex items-start text-white transition-all`}>
            <div className="flex-shrink-0 mr-3 text-2xl opacity-80">{styles.icon}</div>
            <div>
                <p className="font-bold">{alert.title}</p>
                <p className="text-sm text-white/80">{alert.message}</p>
            </div>
            <button onClick={() => onDismiss(alert.id)} className="ml-auto -mt-1 text-white/70 hover:text-white">
                <Icons.Close className='w-5 h-5'/>
            </button>
        </div>
    );
};


interface AlertContainerProps {
  alerts: AlertData[];
  setAlerts: React.Dispatch<React.SetStateAction<AlertData[]>>;
}

export const AlertContainer: React.FC<AlertContainerProps> = ({ alerts, setAlerts }) => {
  const handleDismiss = (id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <div className="fixed top-5 right-5 z-[100] space-y-3">
      {alerts.map(alert => (
        <Alert key={alert.id} alert={alert} onDismiss={handleDismiss} />
      ))}
    </div>
  );
};
