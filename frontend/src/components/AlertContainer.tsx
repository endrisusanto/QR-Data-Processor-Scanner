import React, { useEffect } from 'react';
import { AlertData, AlertType } from '../types';
import { Icons } from './Icons';

interface AlertProps {
  alert: AlertData;
  onDismiss: () => void;
}

const Alert: React.FC<AlertProps> = ({ alert, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss();
        }, 5000);
        return () => clearTimeout(timer);
    }, [alert.id, onDismiss]);

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
            <button onClick={onDismiss} className="ml-auto -mt-1 text-white/70 hover:text-white">
                <Icons.Close className='w-5 h-5'/>
            </button>
        </div>
    );
};


interface AlertContainerProps {
  alert: AlertData | null;
  setAlert: React.Dispatch<React.SetStateAction<AlertData | null>>;
}

export const AlertContainer: React.FC<AlertContainerProps> = ({ alert, setAlert }) => {
  const handleDismiss = () => {
    setAlert(null);
  };

  return (
    <div className="fixed top-5 right-5 z-[100] space-y-3">
      {alert && (
        <Alert alert={alert} onDismiss={handleDismiss} />
      )}
    </div>
  );
};
