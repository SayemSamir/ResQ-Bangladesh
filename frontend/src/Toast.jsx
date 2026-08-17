import React, { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // ৩ সেকেন্ড পর অটো বন্ধ হয়ে যাবে
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: 'bg-emerald-600',
    error: 'bg-red-600',
    info: 'bg-slate-800'
  };

  return (
    <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl text-white text-xs font-semibold shadow-lg flex items-center gap-2 animate-bounce ${bgColors[type] || bgColors.success}`}>
      <span>{type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
      <span>{message}</span>
    </div>
  );
}