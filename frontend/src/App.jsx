import React, { useState, useEffect } from 'react';
import Register from './Register';
import Login from './Login';
import ReportForm from './ReportForm';
import ReportsList from './ReportsList';

export default function App() {
  const [view, setView] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setView('dashboard');
    } else {
      setIsAuthenticated(false);
      setView('login');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setView('login');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚨</span>
            <h1 className="text-xl font-extrabold text-red-600 tracking-wide">ResQ Bangladesh</h1>
          </div>
          
          <div className="flex gap-3 items-center">
            {!isAuthenticated ? (
              <div className="flex gap-2">
                <button 
                  onClick={() => setView('register')} 
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition cursor-pointer ${
                    view === 'register' 
                      ? 'bg-red-600 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Register
                </button>
                <button 
                  onClick={() => setView('login')} 
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition cursor-pointer ${
                    view === 'login' 
                      ? 'bg-red-600 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Login
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setView('report')} 
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition cursor-pointer flex items-center gap-1.5 ${
                    view === 'report' 
                      ? 'bg-red-600 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>+ Create Report</span>
                </button>
                <button 
                  onClick={() => setView('dashboard')} 
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition cursor-pointer ${
                    view === 'dashboard' 
                      ? 'bg-red-600 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  View Reports
                </button>
                <button 
                  onClick={handleLogout} 
                  className="px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 font-medium rounded-xl text-sm transition cursor-pointer border border-slate-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto pt-8">
            {view === 'register' && <Register onRegisterSuccess={() => setView('login')} />}
            {view === 'login' && <Login onLoginSuccess={() => { setIsAuthenticated(true); setView('dashboard'); }} />}
          </div>
        ) : (
          <div>
            {view === 'report' && <ReportForm onSuccess={() => setView('dashboard')} />}
            {view === 'dashboard' && <ReportsList />}
          </div>
        )}
      </main>
    </div>
  );
}