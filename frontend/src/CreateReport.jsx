import React, { useState } from 'react';

export default function CreateReport({ onReportCreated }) {
  const [formData, setFormData] = useState({
    type: 'Medical',
    location: '',
    description: '',
    contact: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate saving or sending to backend API
    setTimeout(() => {
      const newReport = {
        id: Date.now(),
        ...formData,
        status: 'Pending',
        createdAt: new Date().toLocaleTimeString()
      };

      // Retrieve existing reports from localStorage or pass up
      const existing = JSON.parse(localStorage.getItem('resq_reports') || '[]');
      localStorage.setItem('resq_reports', JSON.stringify([newReport, ...existing]));

      setLoading(false);
      setSuccess(true);
      setFormData({ type: 'Medical', location: '', description: '', contact: '' });

      if (onReportCreated) onReportCreated();

      setTimeout(() => setSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md border border-slate-100 mt-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Submit Emergency Report</h2>
      
      {success && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm font-medium">
          Report submitted successfully! Help is being coordinated.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Emergency Type</label>
          <select 
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="Medical">Medical Emergency</option>
            <option value="Flood">Flood / Waterlogging</option>
            <option value="Fire">Fire Hazard</option>
            <option value="Accident">Accident / Rescue</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Location / Area in Bangladesh</label>
          <input 
            type="text" 
            required
            placeholder="e.g., GEC Circle, Chattogram" 
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
          <textarea 
            required
            rows="3"
            placeholder="Briefly describe the situation..." 
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Number</label>
          <input 
            type="tel" 
            required
            placeholder="01XXXXXXXXX" 
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Emergency Report'}
        </button>
      </form>
    </div>
  );
}