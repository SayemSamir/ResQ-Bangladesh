import React, { useState } from 'react';

function ReportForm({ onReportSubmitted }) {
  const [title, setTitle] = useState('');
  const [disasterType, setDisasterType] = useState('Flood');
  const [locationAddress, setLocationAddress] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login first to submit a report.');
      }

      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          disasterType,
          locationAddress,
          description
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to create report');
      }

      setSuccessMsg('Emergency report submitted successfully!');
      setTitle('');
      setLocationAddress('');
      setDescription('');

      if (onReportSubmitted) {
        onReportSubmitted(data);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-white max-w-lg mx-auto shadow-lg">
      <h2 className="text-xl font-bold text-red-500 mb-4">Submit Emergency Report</h2>

      {error && <div className="bg-red-500/20 border border-red-500/40 text-red-400 p-3 rounded mb-4 text-sm">{error}</div>}
      {successMsg && <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 p-3 rounded mb-4 text-sm">{successMsg}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Emergency Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Severe waterlogging in Agrabad"
            required
            className="w-full bg-slate-800 border border-slate-700 rounded p-2.5 text-sm text-white focus:outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Disaster Type</label>
          <select
            value={disasterType}
            onChange={(e) => setDisasterType(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded p-2.5 text-sm text-white focus:outline-none focus:border-red-500"
          >
            <option value="Flood">Flood / Waterlogging</option>
            <option value="Fire">Fire Accident</option>
            <option value="Building Collapse">Building Collapse</option>
            <option value="Medical Emergency">Medical Emergency</option>
            <option value="Cyclone">Cyclone / Storm</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Location Address</label>
          <input
            type="text"
            value={locationAddress}
            onChange={(e) => setLocationAddress(e.target.value)}
            placeholder="e.g. Road 3, CDA Residential Area"
            required
            className="w-full bg-slate-800 border border-slate-700 rounded p-2.5 text-sm text-white focus:outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the current situation..."
            rows="3"
            required
            className="w-full bg-slate-800 border border-slate-700 rounded p-2.5 text-sm text-white focus:outline-none focus:border-red-500"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 transition text-white font-semibold py-2.5 rounded text-sm mt-2"
        >
          Publish Emergency Alert
        </button>
      </form>
    </div>
  );
}

export default ReportForm;