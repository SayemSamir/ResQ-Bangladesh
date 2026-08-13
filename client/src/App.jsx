import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { io } from 'socket.io-client';

import { registerUser, loginUser, createEmergencyReport, getEmergencyReports, updateReportStatus } from './api';

// Establish Socket Connection
const socket = io('http://localhost:5000');

// Leaflet Default Marker Icon Fix
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Helper Function: Parse JWT Payload
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

// --- ১. Login Component ---
function Login({ setToken, setUserRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      const accessToken = response.data.access_token;
      
      localStorage.setItem('token', accessToken);
      setToken(accessToken);

      const decoded = parseJwt(accessToken);
      const role = decoded?.role || 'user';
      setUserRole(role);

      toast.success(`Welcome back! Logged in as ${role}`);
      navigate('/dashboard');
    } catch (error) {
      const detail = error.response?.data?.detail;
      toast.error('Login failed: ' + (typeof detail === 'string' ? detail : error.message));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-xl shadow-xl w-full max-w-md border border-slate-700">
        <h2 className="text-3xl font-bold text-center text-red-500 mb-6">ResQ Bangladesh</h2>
        <h3 className="text-xl font-semibold mb-4 text-slate-200">Account Login</h3>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 font-semibold rounded-lg transition duration-200 shadow-md cursor-pointer"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-red-400 hover:underline font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

// --- ২. Register Component ---
function Register() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ fullName, email, phone, password, role });
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      const detail = error.response?.data?.detail;
      toast.error('Registration failed: ' + (typeof detail === 'string' ? detail : error.message));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-xl shadow-xl w-full max-w-md border border-slate-700">
        <h2 className="text-3xl font-bold text-center text-red-500 mb-6">ResQ Bangladesh</h2>
        <h3 className="text-xl font-semibold mb-4 text-slate-200">Create Account</h3>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Phone Number</label>
            <input
              type="text"
              placeholder="01700000000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Account Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
            >
              <option value="user">General User / Victim</option>
              <option value="admin">Rescue Team / Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 font-semibold rounded-lg transition duration-200 shadow-md cursor-pointer"
          >
            Register
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-red-400 hover:underline font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

// --- ৩. Dashboard Component ---
function Dashboard({ setToken, userRole }) {
  const [title, setTitle] = useState('');
  const [disasterType, setDisasterType] = useState('Flood');
  const [locationAddress, setLocationAddress] = useState('');
  const [description, setDescription] = useState('');

  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const defaultCenter = [22.3569, 91.7832];

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const response = await getEmergencyReports();
      setReports(response.data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      toast.error('Failed to load emergency reports');
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    fetchReports();

    socket.on('new_report', (newReport) => {
      setReports((prevReports) => [newReport, ...prevReports]);
      toast.success(`New emergency alert: ${newReport.title}`);
    });

    socket.on('status_updated', (updatedReport) => {
      setReports((prevReports) =>
        prevReports.map((report) =>
          (report.id === updatedReport.id || report._id === updatedReport._id) ? updatedReport : report
        )
      );
    });

    return () => {
      socket.off('new_report');
      socket.off('status_updated');
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleEmergencyReport = async (e) => {
    e.preventDefault();
    try {
      await createEmergencyReport({ title, disasterType, locationAddress, description });
      toast.success('Emergency report submitted successfully!');
      setTitle('');
      setLocationAddress('');
      setDescription('');
      fetchReports();
    } catch (error) {
      const detail = error.response?.data?.detail;
      toast.error('Failed to submit report: ' + (typeof detail === 'string' ? detail : error.message));
    }
  };

  const handleStatusChange = async (reportId, newStatus) => {
    if (userRole !== 'admin') {
      toast.error('Only admins/rescue teams can update report status!');
      return;
    }

    try {
      await updateReportStatus(reportId, newStatus);
      toast.success(`Report status updated to "${newStatus}"`);
      fetchReports();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update report status');
    }
  };

  const exportToCSV = () => {
    if (filteredReports.length === 0) {
      toast.error('No reports available to export!');
      return;
    }

    const headers = ['ID', 'Title', 'Disaster Type', 'Location', 'Status', 'Description'];
    const rows = filteredReports.map((r) => [
      r.id || r._id || '',
      `"${r.title?.replace(/"/g, '""') || ''}"`,
      `"${r.disaster_type || ''}"`,
      `"${r.location_address?.replace(/"/g, '""') || ''}"`,
      `"${r.status || 'Pending'}"`,
      `"${r.description?.replace(/"/g, '""') || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `resq_emergency_reports_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV Report exported successfully!');
  };

  const filteredReports = reports.filter((item) => {
    const matchesType = filterType === 'All' || item.disaster_type === filterType;
    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location_address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-12">
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-red-500 tracking-wide">ResQ Bangladesh</h1>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
              userRole === 'admin' ? 'bg-red-950 text-red-400 border border-red-700' : 'bg-slate-700 text-slate-300'
            }`}>
              {userRole === 'admin' ? 'Admin / Rescue Team' : 'User'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-md border border-slate-600 transition duration-150 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-8">
        <section className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
            🚨 Create Emergency Request
          </h3>
          <form onSubmit={handleEmergencyReport} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Title (e.g. Severe Flooding)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-slate-500"
                  required
                />
              </div>
              <div>
                <select
                  value={disasterType}
                  onChange={(e) => setDisasterType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                >
                  <option value="Flood">Flood</option>
                  <option value="Fire">Fire</option>
                  <option value="Medical">Medical</option>
                  <option value="Cyclone">Cyclone</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <input
              type="text"
              placeholder="Location Address (e.g. Agrabad, Chattogram)"
              value={locationAddress}
              onChange={(e) => setLocationAddress(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-slate-500"
              required
            />

            <textarea
              placeholder="Describe the emergency in detail..."
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-slate-500"
              required
            />

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition duration-200 shadow-md cursor-pointer"
            >
              Submit Emergency Report
            </button>
          </form>
        </section>

        <section className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
            🗺️ Live Emergency Map
          </h3>
          <div className="h-72 w-full rounded-lg overflow-hidden border border-slate-700 z-10">
            <MapContainer center={defaultCenter} zoom={11} className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredReports.map((report, idx) => {
                const lat = report.latitude || 22.3569 + idx * 0.005;
                const lng = report.longitude || 91.7832 + idx * 0.005;
                return (
                  <Marker key={report.id || report._id || idx} position={[lat, lng]}>
                    <Popup>
                      <div className="text-slate-900">
                        <strong className="text-red-600 block">{report.title}</strong>
                        <span className="text-xs font-semibold px-2 py-0.5 bg-slate-200 rounded">
                          {report.disaster_type}
                        </span>
                        <p className="text-xs mt-1">{report.location_address}</p>
                        <p className="text-xs font-bold text-slate-700 mt-1">Status: {report.status || 'Pending'}</p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </section>

        <section className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h3 className="text-xl font-bold text-slate-100">Recent Emergency Reports</h3>
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg transition shadow flex items-center gap-2 cursor-pointer"
            >
              📥 Export CSV
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              placeholder="Search by title, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white text-sm"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white text-sm"
            >
              <option value="All">All Types</option>
              <option value="Flood">Flood</option>
              <option value="Fire">Fire</option>
              <option value="Medical">Medical</option>
              <option value="Cyclone">Cyclone</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {loadingReports ? (
            <p className="text-slate-400 text-center py-6">Loading reports...</p>
          ) : filteredReports.length === 0 ? (
            <p className="text-slate-400 text-center py-6">No matching emergency reports found.</p>
          ) : (
            <div className="grid gap-4">
              {filteredReports.map((item, index) => (
                <div key={item.id || item._id || index} className="p-4 bg-slate-900 rounded-lg border border-slate-700/80 hover:border-slate-600 transition space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-bold text-red-400 text-lg">{item.title}</h4>
                      <span className="text-xs px-2.5 py-0.5 bg-slate-800 text-slate-300 rounded-full border border-slate-700 font-medium inline-block mt-1">
                        {item.disaster_type}
                      </span>
                    </div>

                    {userRole === 'admin' ? (
                      <select
                        value={item.status || 'Pending'}
                        onChange={(e) => handleStatusChange(item.id || item._id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md border outline-none cursor-pointer ${
                          item.status === 'Rescued'
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-700'
                            : item.status === 'In Progress'
                            ? 'bg-amber-950 text-amber-400 border-amber-700'
                            : 'bg-red-950 text-red-400 border-red-700'
                        }`}
                      >
                        <option value="Pending" className="bg-slate-900 text-white">Pending</option>
                        <option value="In Progress" className="bg-slate-900 text-white">In Progress</option>
                        <option value="Rescued" className="bg-slate-900 text-white">Rescued</option>
                      </select>
                    ) : (
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
                        item.status === 'Rescued'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-700'
                          : item.status === 'In Progress'
                          ? 'bg-amber-950 text-amber-400 border-amber-700'
                          : 'bg-red-950 text-red-400 border-red-700'
                      }`}>
                        {item.status || 'Pending'}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-300 flex items-center gap-1">
                    📍 <span><strong>Location:</strong> {item.location_address}</span>
                  </p>
                  <p className="text-sm text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// --- Main App Route Controller ---
export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userRole, setUserRole] = useState(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      const decoded = parseJwt(savedToken);
      return decoded?.role || 'user';
    }
    return 'user';
  });

  return (
    <div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155',
          },
        }}
      />

      <Routes>
        <Route path="/login" element={!token ? <Login setToken={setToken} setUserRole={setUserRole} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={token ? <Dashboard setToken={setToken} userRole={userRole} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </div>
  );
}