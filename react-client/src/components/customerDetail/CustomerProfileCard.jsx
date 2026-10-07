import React from 'react';

export default function CustomerProfileCard({ customer }) {
  if (!customer) return null;

  const requestedFields = [
    'customerID', 'gender', 'SeniorCitizen', 'Partner', 'Dependents',
    'tenure', 'PhoneService', 'MultipleLines', 'InternetService', 'OnlineSecurity',
    'OnlineBackup', 'DeviceProtection', 'TechSupport', 'StreamingTV', 'StreamingMovies',
    'Contract', 'PaperlessBilling', 'PaymentMethod', 'MonthlyCharges', 'TotalCharges', 'Churn'
  ];

  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, ' \$1')
      .trim()
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  const formatValue = (key, value) => {
    if (value === null || value === undefined || String(value).trim() === '') {
      return <span className="text-slate-300 italic">None</span>;
    }

    if (key === 'SeniorCitizen') {
      return String(value) === '1' || value === true ? 'Yes (1)' : 'No (0)';
    }

    if (key === 'MonthlyCharges' || key === 'TotalCharges') {
      const num = Number(value);
      return isNaN(num) ? String(value) : `$${num.toFixed(2)}`;
    }

    if (key === 'Churn' && String(value).trim().toUpperCase() === 'YES') {
      return <span className="text-rose-600 font-black">Yes</span>;
    }

    return String(value);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
      <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-900">
        <div className="space-y-0.5">
          <span className="text-[10px] font-black tracking-widest text-indigo-400 uppercase">Core Portfolio Metrics</span>
          <h3 className="text-sm font-black text-white uppercase tracking-wider">
            Account Profile Registry Log
          </h3>
        </div>
        <div className="bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 px-3 py-1 rounded-md font-mono text-xs font-bold">
          21 Fields Active
        </div>
      </div>

      <div className="p-6 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {requestedFields.map((fieldKey) => {
            const rawValue = customer[fieldKey] !== undefined ? customer[fieldKey] : customer[fieldKey.toLowerCase()];

            return (
              <div
                key={fieldKey}
                className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 shadow-inner hover:bg-slate-100/50 hover:border-slate-300 transition-all duration-75 group"
              >
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 truncate group-hover:text-slate-500 transition-colors">
                  {formatLabel(fieldKey)}
                </span>
                <span className="block text-xs font-bold text-slate-800 tracking-tight break-words">
                  {formatValue(fieldKey, rawValue)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-400 font-semibold">
        <span>DATABASE SCHEMATIC MAPPING: VERIFIED COMPLETE</span>
        <span className="text-slate-300">|</span>
        <span>STATUS: LIVE CACHE READ</span>
      </div>
    </div>
  );
}
