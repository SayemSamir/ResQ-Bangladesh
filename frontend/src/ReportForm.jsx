import React, { useState } from 'react';
import { createReport } from './api';

export default function ReportForm({ onClose, onSuccess, onReportCreated }) {
  const [formData, setFormData] = useState({
    emergency_type: 'Medical',
    title: '',
    description: '',
    location: '',
    created_by: ''
  });
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Get user's current GPS location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setFormData((prev) => ({ 
          ...prev, 
          location: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}` 
        }));
        setLocating(false);
      },
      () => {
        alert('Unable to retrieve your location. Please type manually.');
        setLocating(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    // ব্যাকএন্ডের মডেল রিকোয়ারমেন্ট মেটানোর জন্য disasterType সহ পাঠানো হচ্ছে
    const payload = {
      disasterType: formData.emergency_type,
      emergency_type: formData.emergency_type,
      title: formData.title,
      description: formData.description,
      location: formData.location,
      created_by: formData.created_by
    };

    try {
      await createReport(payload);
      setMessage({ text: 'Emergency report submitted successfully!', type: 'success' });
      setFormData({
        emergency_type: 'Medical',
        title: '',
        description: '',
        location: '',
        created_by: ''
      });

      if (onSuccess) onSuccess();
      if (onReportCreated) onReportCreated();
      
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (err) {
      const errorDetail = err.response?.data?.detail;
      let errorMessage = 'Failed to submit emergency report';

      if (typeof errorDetail === 'string') {
        errorMessage = errorDetail;
      } else if (Array.isArray(errorDetail)) {
        errorMessage = errorDetail.map(err => `${err.loc.join('.')}: ${err.msg}`).join(', ');
      }

      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[9999] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 relative max-h-[95vh] overflow-y-auto">
        {onClose && (
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
          >
            ✕
          </button>
        )}

        <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">
          🚨 Report an Emergency
        </h3>

        {message.text && (
          <div className={`mb-4 p-3 rounded-xl text-xs font-medium text-center border ${
            message.type === 'success' 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-red-50 text-red-600 border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Type</label>
            <select
              name="emergency_type"
              value={formData.emergency_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
            >
              <option value="Medical">Medical</option>
              <option value="Fire">Fire</option>
              <option value="Flood">Flood</option>
              <option value="Crime">Crime</option>
              <option value="Accident">Accident</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g., Severe Fire at GEC Circle"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              name="description"
              rows="3"
              required
              placeholder="Describe the situation in detail..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700">Location</label>
              <button 
                type="button"
                onClick={handleGetLocation}
                disabled={locating}
                className="text-xs text-red-600 hover:underline font-semibold cursor-pointer"
              >
                {locating ? 'Fetching GPS...' : '📍 Use Current GPS'}
              </button>
            </div>
            <input
              type="text"
              name="location"
              required
              placeholder="Lat: 22.35, Lng: 91.78 or Area Name"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Reported By (Optional)</label>
            <input
              type="text"
              name="created_by"
              placeholder="Your Name or Anonymous"
              value={formData.created_by}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Emergency Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}