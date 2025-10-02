import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

let toastId = 0;
const toastCallbacks = new Set();

export const toast = {
  success: (message) => {
    const id = ++toastId;
    toastCallbacks.forEach(callback => callback({
      id,
      type: 'success',
      message,
      timestamp: Date.now()
    }));
  },
  error: (message) => {
    const id = ++toastId;
    toastCallbacks.forEach(callback => callback({
      id,
      type: 'error',
      message,
      timestamp: Date.now()
    }));
  }
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (newToast) => {
      setToasts(prev => [...prev, newToast]);
      
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 4000);
    };

    toastCallbacks.add(handleToast);
    
    return () => {
      toastCallbacks.delete(handleToast);
    };
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 p-4 rounded-lg border backdrop-blur-sm animate-in slide-in-from-right-full duration-300 ${
            toast.type === 'success' 
              ? 'bg-green-900/80 border-green-600 text-green-100' 
              : 'bg-red-900/80 border-red-600 text-red-100'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span className="font-['Jost'] text-sm">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 hover:opacity-70"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};