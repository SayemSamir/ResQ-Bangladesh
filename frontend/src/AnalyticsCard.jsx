import React from 'react';

export default function AnalyticsCard({ reports }) {
  const total = reports.length;
  if (total === 0) return null;

  const getCount = (type) => reports.filter(r => r.emergency_type === type).length;
  
  const medical = getCount('Medical');
  const fire = getCount('Fire');
  const flood = getCount('Flood');
  const crime = getCount('Crime');

  const getPercentage = (count) => ((count / total) * 100).toFixed(1);

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-6">
      <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
        📊 Emergency Distribution Analytics
      </h3>

      <div className="space-y-3 text-xs">
        {/* Medical */}
        <div>
          <div className="flex justify-between font-medium text-slate-600 mb-1">
            <span>Medical ({medical})</span>
            <span>{getPercentage(medical)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${getPercentage(medical)}%` }}
            ></div>
          </div>
        </div>

        {/* Fire */}
        <div>
          <div className="flex justify-between font-medium text-slate-600 mb-1">
            <span>Fire ({fire})</span>
            <span>{getPercentage(fire)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-orange-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${getPercentage(fire)}%` }}
            ></div>
          </div>
        </div>

        {/* Flood */}
        <div>
          <div className="flex justify-between font-medium text-slate-600 mb-1">
            <span>Flood ({flood})</span>
            <span>{getPercentage(flood)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${getPercentage(flood)}%` }}
            ></div>
          </div>
        </div>

        {/* Crime */}
        <div>
          <div className="flex justify-between font-medium text-slate-600 mb-1">
            <span>Crime ({crime})</span>
            <span>{getPercentage(crime)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-purple-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${getPercentage(crime)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}