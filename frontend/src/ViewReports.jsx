import React, { useState, useEffect } from 'react';

export default function ViewReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const loadedReports = JSON.parse(localStorage.getItem('resq_reports') || '[]');
    setReports(loadedReports);
  }, []);

  const handleDelete = (id) => {
    const updated = reports.filter(r => r.id !== id);
    setReports(updated);
    localStorage.setItem('resq_reports', JSON.stringify(updated));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Emergency Reports Dashboard</h2>
      
      {reports.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center text-slate-500">
          No emergency reports found.
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 bg-red-100 text-red-700 font-semibold text-xs rounded-full">
                    {report.type}
                  </span>
                  <span className="text-xs text-slate-400">{report.createdAt}</span>
                </div>
                <h3 className="font-bold text-slate-800 text-lg">{report.location}</h3>
                <p className="text-slate-600 text-sm mt-1">{report.description}</p>
                <p className="text-xs text-slate-500 mt-2 font-medium">Contact: {report.contact}</p>
              </div>
              <div className="flex items-center gap-2 self-end md:self-center">
                <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-semibold">
                  Pending
                </span>
                <button 
                  onClick={() => handleDelete(report.id)}
                  className="px-3 py-1 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg text-xs font-medium transition cursor-pointer"
                >
                  Resolve / Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}