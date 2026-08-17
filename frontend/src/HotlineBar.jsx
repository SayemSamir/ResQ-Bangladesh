import React from 'react';

export default function HotlineBar() {
  const hotlines = [
    { name: 'National Emergency', number: '999', icon: '🚨', color: 'bg-red-600' },
    { name: 'Police Control Room', number: '999', icon: '👮', color: 'bg-blue-600' },
    { name: 'Fire Service', number: '102', icon: '🚒', color: 'bg-orange-600' },
    { name: 'Ambulance Service', number: '199', icon: '🚑', color: 'bg-emerald-600' },
  ];

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6">
      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 text-center">Emergency Hotlines (Bangladesh)</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {hotlines.map((item, index) => (
          <a 
            key={index} 
            href={`tel:${item.number}`}
            className={`${item.color} text-white p-3 rounded-xl flex items-center justify-between shadow-sm hover:opacity-90 transition cursor-pointer`}
          >
            <div>
              <p className="text-[10px] uppercase font-medium opacity-90">{item.name}</p>
              <p className="text-sm font-extrabold">{item.number}</p>
            </div>
            <span className="text-xl">{item.icon}</span>
          </a>
        ))}
      </div>
    </div>
  );
}