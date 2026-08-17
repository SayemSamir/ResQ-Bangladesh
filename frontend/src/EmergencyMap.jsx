import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function EmergencyMap({ reports, onSelectReport }) {
  // Default center: Chattogram, Bangladesh
  const defaultCenter = [22.3569, 91.7832];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
      <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
        🗺️ Live Emergency Map (Chattogram)
      </h3>
      <div className="h-[350px] w-full rounded-lg overflow-hidden z-0">
        <MapContainer 
          center={defaultCenter} 
          zoom={13} 
          scrollWheelZoom={false} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {reports.map((report) => {
            const lat = report.lat || 22.3569;
            const lng = report.lng || 91.7832;

            return (
              <Marker key={report.id} position={[lat, lng]}>
                <Popup>
                  <div className="p-1 space-y-1">
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 font-semibold text-[10px] rounded-full">
                      {report.emergency_type}
                    </span>
                    <h4 className="font-bold text-slate-800 text-sm">{report.title}</h4>
                    <p className="text-xs text-slate-600">{report.location}</p>
                    {onSelectReport && (
                      <button 
                        onClick={() => onSelectReport(report)}
                        className="mt-1 text-xs text-red-600 font-semibold hover:underline cursor-pointer block"
                      >
                        View Details →
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}