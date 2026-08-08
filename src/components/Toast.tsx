import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-lg border text-sm transition-all transform animate-in slide-in-from-top-2 duration-200 ${
            toast.type === 'success'
              ? 'bg-slate-900 text-white border-emerald-500/30'
              : toast.type === 'error'
              ? 'bg-rose-950 text-rose-100 border-rose-500/30'
              : 'bg-slate-800 text-slate-100 border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
            <span className="font-medium text-xs sm:text-sm">{toast.message}</span>
          </div>
          <button
            onClick={() => onClose(toast.id)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors ml-2"
            aria-label="Close toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
