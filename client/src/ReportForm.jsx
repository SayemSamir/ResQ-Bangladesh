import React, { useEffect, useState } from 'react';
import { getEmergencyReports } from './api';

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await getEmergencyReports();
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <div>Loading reports...</div>;

  return (
    <div>
      <h2>Emergency Reports Dashboard</h2>
      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <ul>
          {reports.map((report) => (
            <li key={report.id || report._id}>
              <h3>{report.title}</h3>
              <p><strong>Type:</strong> {report.disasterType || report.disaster_type}</p>
              <p><strong>Location:</strong> {report.locationAddress || report.location_address}</p>
              <p>{report.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}