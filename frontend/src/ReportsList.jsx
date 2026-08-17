import React, { useEffect, useState } from 'react';
import { getReports, deleteReport, updateReportStatus } from './api';
import EmergencyMap from './EmergencyMap';
import Toast from './Toast';
import HotlineBar from './HotlineBar';
import ReportModal from './ReportModal';
import ReportForm from './ReportForm';
import AnalyticsCard from './AnalyticsCard';
import UserProfile from './UserProfile';

export default function ReportsList() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [viewMode, setViewMode] = useState('both');
  const [error, setError] = useState('');
  const [loadingId, setLoadingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Initial fetch and Real-time Polling (Auto-refresh every 10 seconds)
  useEffect(() => {
    fetchReports();
    
    const interval = setInterval(() => {
      fetchReports();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let result = reports;
    
    // Emergency Type Filter
    if (filter !== 'All') {
      result = result.filter(r => r.emergency_type === filter);
    }

    // Status / My Reports Filter
    if (statusFilter === 'My Reports') {
      const currentUser = localStorage.getItem('userEmail') || 'sayemuddinsamir000@gmail.com';
      result = result.filter(r => r.created_by === currentUser);
    } else if (statusFilter !== 'All') {
      result = result.filter(r => (r.status || 'Pending') === statusFilter);
    }

    // Date Range Filter
    if (dateFilter === 'Today') {
      const today = new Date().toISOString().slice(0, 10);
      result = result.filter(r => r.created_at && r.created_at.slice(0, 10) === today);
    } else if (dateFilter === 'Week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      result = result.filter(r => r.created_at && new Date(r.created_at) >= oneWeekAgo);
    }

    // Search Query Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        r => r.title.toLowerCase().includes(q) || r.location.toLowerCase().includes(q)
      );
    }
    setFilteredReports(result);
  }, [filter, statusFilter, dateFilter, searchQuery, reports]);

  const fetchReports = async () => {
    try {
      const response = await getReports();
      const data = Array.isArray(response) ? response : (response?.data || []);
      setReports(data);
    } catch (err) {
      setError('Failed to fetch emergency reports');
    }
  };

  // Delete Report Handler
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this emergency report?')) {
      setLoadingId(id);
      try {
        await deleteReport(id);
        setReports(prev => prev.filter(r => r.id !== id));
        setToast({ message: 'Report deleted successfully!', type: 'success' });
      } catch (error) {
        setToast({ message: 'Failed to delete report. Please try again.', type: 'error' });
      } finally {
        setLoadingId(null);
      }
    }
  };

  // Status Change Handler (In Progress / Resolved)
  const handleStatusChange = async (id, newStatus, e) => {
    e.stopPropagation();
    try {
      await updateReportStatus(id, newStatus);
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      setToast({ message: `Report status updated to ${newStatus}!`, type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to update status. Please try again.', type: 'error' });
    }
  };

  const handleExportCSV = () => {
    if (reports.length === 0) {
      setToast({ message: 'No reports available to export!', type: 'error' });
      return;
    }

    const headers = ['ID', 'Type', 'Title', 'Description', 'Location', 'Status', 'Reported By'];
    const csvRows = [
      headers.join(','),
      ...reports.map(r => [
        r.id,
        `"${r.emergency_type || ''}"`,
        `"${(r.title || '').replace(/"/g, '""')}"`,
        `"${(r.description || '').replace(/"/g, '""')}"`,
        `"${(r.location || '').replace(/"/g, '""')}"`,
        `"${r.status || 'Pending'}"`,
        `"${r.created_by || 'Anonymous'}"`
      ].join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `emergency_reports_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToast({ message: 'Reports exported successfully as CSV!', type: 'success' });
  };

  const safeReports = Array.isArray(reports) ? reports : [];
  const totalCount = safeReports.length;
  const medicalCount = safeReports.filter(r => r.emergency_type === 'Medical').length;
  const fireCount = safeReports.filter(r => r.emergency_type === 'Fire').length;
  const floodCount = safeReports.filter(r => r.emergency_type === 'Flood').length;
  const crimeCount = safeReports.filter(r => r.emergency_type === 'Crime').length;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-800 text-center md:text-left">Emergency Reports Dashboard</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsProfileOpen(true)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            👤 Profile
          </button>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs transition cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            🚨 Report Emergency
          </button>
        </div>
      </div>
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <ReportModal 
        report={selectedReport} 
        onClose={() => setSelectedReport(null)} 
      />

      <UserProfile 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        onUpdate={fetchReports}
      />

      {isFormOpen && (
        <ReportForm 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={() => {
            fetchReports();
            setToast({ message: 'Emergency report submitted successfully!', type: 'success' });
          }}
        />
      )}

      {/* Statistics Counter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-xs text-slate-500 font-medium">Total</p>
          <p className="text-xl font-bold text-slate-800">{totalCount}</p>
        </div>
        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 shadow-sm text-center">
          <p className="text-xs text-emerald-600 font-medium">Medical</p>
          <p className="text-xl font-bold text-emerald-700">{medicalCount}</p>
        </div>
        <div className="bg-orange-50 p-3 rounded-xl border border-orange-200 shadow-sm text-center">
          <p className="text-xs text-orange-600 font-medium">Fire</p>
          <p className="text-xl font-bold text-orange-700">{fireCount}</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 shadow-sm text-center">
          <p className="text-xs text-blue-600 font-medium">Flood</p>
          <p className="text-xl font-bold text-blue-700">{floodCount}</p>
        </div>
        <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 shadow-sm text-center col-span-2 md:col-span-1">
          <p className="text-xs text-purple-600 font-medium">Crime</p>
          <p className="text-xl font-bold text-purple-700">{crimeCount}</p>
        </div>
      </div>

      <AnalyticsCard reports={reports} />
      <HotlineBar />

      {/* View Mode & Export Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex justify-center gap-2">
          {['both', 'map', 'list'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer capitalize ${
                viewMode === mode ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {mode === 'both' ? '🗺️ & 📋 Both' : mode === 'map' ? '🗺️ Map Only' : '📋 List Only'}
            </button>
          ))}
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer flex items-center gap-1.5"
        >
          📥 Export CSV
        </button>
      </div>

      {(viewMode === 'both' || viewMode === 'map') && (
        <EmergencyMap reports={filteredReports} onSelectReport={setSelectedReport} />
      )}

      {(viewMode === 'both' || viewMode === 'list') && (
        <>
          <div className="space-y-4 mb-6">
            <div className="max-w-md mx-auto">
              <input 
                type="text" 
                placeholder="Search by title or location (e.g. GEC, Flood)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-sm shadow-sm"
              />
            </div>

            {/* Status & My Reports Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2">
              {['All', 'My Reports', 'Pending', 'In Progress', 'Resolved'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    statusFilter === st 
                      ? 'bg-red-600 text-white' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {st === 'All' ? '📌 All Status' : st === 'My Reports' ? '👤 My Reports' : st}
                </button>
              ))}
            </div>

            {/* Date Range Filter Tabs */}
            <div className="flex justify-center gap-2">
              {['All', 'Today', 'Week'].map((df) => (
                <button
                  key={df}
                  onClick={() => setDateFilter(df)}
                  className={`px-3.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    dateFilter === df 
                      ? 'bg-slate-800 text-white' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {df === 'All' ? '📅 All Time' : df === 'Today' ? '📅 Today' : '📅 Last 7 Days'}
                </button>
              ))}
            </div>

            {/* Emergency Type Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2">
              {['All', 'Medical', 'Fire', 'Flood', 'Crime'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                    filter === type 
                      ? 'bg-slate-800 text-white shadow-sm' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium text-center">
              {error}
            </div>
          )}

          {filteredReports.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center text-slate-500">
              No emergency reports found.
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredReports.map((report) => {
                const currentStatus = report.status || 'Pending';
                return (
                  <div 
                    key={report.id} 
                    onClick={() => setSelectedReport(report)}
                    className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:border-red-300 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 bg-red-100 text-red-700 font-semibold text-xs rounded-full">
                          {report.emergency_type}
                        </span>
                        <span className={`px-2.5 py-0.5 font-semibold text-xs rounded-full ${
                          currentStatus === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                          currentStatus === 'In Progress' ? 'bg-orange-100 text-orange-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {currentStatus}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg">{report.title}</h3>
                      <p className="text-slate-600 text-sm line-clamp-1">{report.description}</p>
                      
                      <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 flex-wrap">
                        <strong className="text-slate-700">Location:</strong> 
                        <span>{report.location}</span>
                      </p>

                      <p className="text-xs text-slate-400">
                        <strong className="text-slate-600">Reported By:</strong> {report.created_by || 'Anonymous'}
                      </p>
                    </div>

                    <div className="self-end md:self-center flex items-center gap-2">
                      {currentStatus !== 'In Progress' && (
                        <button
                          onClick={(e) => handleStatusChange(report.id, 'In Progress', e)}
                          className="px-2.5 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 font-medium rounded-lg text-xs transition cursor-pointer"
                        >
                          In Progress
                        </button>
                      )}

                      {currentStatus !== 'Resolved' && (
                        <button
                          onClick={(e) => handleStatusChange(report.id, 'Resolved', e)}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium rounded-lg text-xs transition cursor-pointer"
                        >
                          Resolve
                        </button>
                      )}

                      <button
                        onClick={(e) => handleDelete(report.id, e)}
                        disabled={loadingId === report.id}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 font-medium rounded-lg text-xs transition duration-200 cursor-pointer disabled:opacity-50"
                      >
                        {loadingId === report.id ? 'Deleting...' : '🗑️ Delete'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}