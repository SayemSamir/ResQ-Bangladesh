import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const socket = io('http://localhost:5000');

function Dashboard() {
  const [reports, setReports] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState('user');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/reports', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setReports(data);
        }
      } catch (error) {
        console.error('Error fetching initial reports:', error);
      }
    };

    fetchReports();

    socket.on('new_report', (newReport) => {
      console.log('⚡ New Emergency Report Received:', newReport);
      setReports((prevReports) => [newReport, ...prevReports]);
    });

    socket.on('status_updated', (updatedReport) => {
      console.log('🔄 Report Status Updated:', updatedReport);
      setReports((prevReports) =>
        prevReports.map((report) =>
          report._id === updatedReport._id ? updatedReport : report
        )
      );
    });

    return () => {
      socket.off('new_report');
      socket.off('status_updated');
    };
  }, []);

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.detail || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-red-500">ResQ Bangladesh - Live Dashboard</h1>
        <p className="text-sm text-gray-400">Real-time emergency monitoring and response system</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b border-slate-800 pb-2">Recent Emergency Reports</h2>
          
          <div className="space-y-4">
            {reports.length === 0 ? (
              <p className="text-gray-500">No emergency reports found.</p>
            ) : (
              reports.map((report) => (
                <div key={report._id || report.id} className="p-4 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-red-400">{report.title}</h3>
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Type: {report.disaster_type}</p>
                    <p className="text-sm text-gray-300 mb-2">📍 {report.location_address}</p>
                    <p className="text-sm text-gray-400">{report.description}</p>
                    
                    <span className={`inline-block mt-3 px-2.5 py-1 text-xs rounded font-semibold ${
                      report.status === 'Pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      report.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {report.status}
                    </span>
                  </div>

                  {currentUserRole === 'admin' && (
                    <div className="ml-4">
                      <select
                        value={report.status}
                        onChange={(e) => handleStatusChange(report._id || report.id, e.target.value)}
                        className="bg-slate-800 text-white border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-red-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-900 rounded-lg border border-slate-800 p-2 h-[500px] overflow-hidden">
          <MapContainer 
            center={[22.3569, 91.7832]} 
            zoom={13} 
            scrollWheelZoom={false} 
            style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {reports.map((report) => (
              report.latitude && report.longitude && (
                <Marker key={report._id || report.id} position={[report.latitude, report.longitude]}>
                  <Popup>
                    <div className="text-slate-900">
                      <h4 className="font-bold">{report.title}</h4>
                      <p className="text-xs text-gray-600">{report.location_address}</p>
                      <span className={`inline-block mt-1 px-1.5 py-0.5 text-[10px] rounded font-semibold ${
                        report.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                        report.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;