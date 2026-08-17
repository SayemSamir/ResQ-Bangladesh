import React from 'react';

export default function ReportModal({ report, onClose }) {
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 relative animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition cursor-pointer"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-slate-400">ID: #{report.id}</span>
          <span className="px-2.5 py-0.5 bg-red-100 text-red-700 font-semibold text-xs rounded-full">
            {report.emergency_type}
          </span>
          <span className={`px-2.5 py-0.5 font-semibold text-xs rounded-full ${
            (report.status || 'Pending') === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
            (report.status || 'Pending') === 'In Progress' ? 'bg-orange-100 text-orange-700' :
            'bg-amber-100 text-amber-700'
          }`}>
            {report.status || 'Pending'}
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-2">{report.title}</h3>
        
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 mb-4">
          <p className="text-slate-600 text-sm leading-relaxed">{report.description}</p>
        </div>

        <div className="space-y-2 text-xs text-slate-500 mb-6 border-t border-slate-100 pt-4">
          <div className="flex justify-between">
            <strong className="text-slate-700">Location:</strong>
            <span className="text-slate-600">{report.location}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-slate-700">Reported By:</strong>
            <span className="text-slate-600">{report.created_by || 'Anonymous'}</span>
          </div>
          {report.created_at && (
            <div className="flex justify-between">
              <strong className="text-slate-700">Time:</strong>
              <span className="text-slate-600">{new Date(report.created_at).toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl text-xs transition cursor-pointer shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}