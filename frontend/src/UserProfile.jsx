import React, { useState, useEffect } from 'react';

export default function UserProfile({ isOpen, onClose, onUpdate }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    setEmail(localStorage.getItem('userEmail') || 'sayemuddinsamir000@gmail.com');
    setName(localStorage.getItem('userName') || 'Gazi Sayem Uddin Samir');
  }, [isOpen]);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', name);
    if (onUpdate) onUpdate();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition cursor-pointer"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          👤 User Profile Settings
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email (Used for "My Reports" filter)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}