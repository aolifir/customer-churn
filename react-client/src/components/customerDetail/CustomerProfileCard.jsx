// import React from 'react';
//
// export default function CustomerProfileCard({ customer }) {
//   const formatCurrency = (value) => {
//     if (value === undefined || value === null) return '\$0.00';
//     const num = Number(value);
//     return isNaN(num) ? value : `$${num.toFixed(2)}`;
//   };
//
//   const accountMetrics = [
//     { label: 'Assigned Customer ID', value: customer.customerID, isMono: true, fullWidth: true },
//     { label: 'Gender Classification', value: customer.gender || 'Not Specified' },
//     {
//       label: 'Senior Citizen Status',
//       value: Number(customer.SeniorCitizen) === 1 ? 'True (Age 65+ Portfolio)' : 'False'
//     },
//     {
//   label: 'Account Tenure Length',
//   value: `${customer.tenure || 0} ${Number(customer.tenure) === 1 ? 'Month' : 'Months'}`
// },
//     { label: 'Active Internet Configuration', value: customer.InternetService || 'None' },
//     { label: 'Contractual Billing Structure', value: customer.Contract || 'Month-to-month' },
//     { label: 'Transaction Payment Path', value: customer.PaymentMethod || 'Not Provided' },
//     { label: 'Monthly Base Invoicing Rate', value: formatCurrency(customer.MonthlyCharges) },
//     { label: 'Accumulated Lifetime Charges', value: formatCurrency(customer.TotalCharges) },
//   ];
//
//   return (
//     <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-6">
//       <div className="flex items-center justify-between border-b border-slate-100 pb-4">
//         <div>
//           <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block">Profile Target</span>
//           <h3 className="text-lg font-bold text-slate-900 mt-0.5">Account Diagnostics</h3>
//         </div>
//         <span className="text-[11px] bg-slate-100 font-bold text-slate-500 px-3 py-1 rounded-full border border-slate-200 shadow-inner">
//           Verified Core Record
//         </span>
//       </div>
//
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {accountMetrics.map((metric, index) => (
//           <div
//             key={index}
//             className={`p-4 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-200/60 transition-all duration-200 group ${
//               metric.fullWidth ? 'sm:col-span-2 bg-slate-100/40 border-slate-200' : ''
//             }`}
//           >
//             <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1 group-hover:text-slate-500 transition-colors">
//               {metric.label}
//             </span>
//             <span className={`text-sm font-bold text-slate-800 tracking-tight truncate block ${
//               metric.isMono ? 'font-mono text-indigo-600 text-base' : ''
//             }`}>
//               {metric.value}
//             </span>
//           </div>
//         ))}
//       </div>
//
//       <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
//         <div className="flex items-center gap-2">
//           <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Phone Line State:</span>
//           <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">
//             {customer.PhoneService === 'Yes' ? `Active (${customer.MultipleLines || 'Single Line'})` : 'Inactive Line'}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }
//

import React from 'react';

export default function CustomerProfileCard({ customer }) {
  if (!customer) return null;

  // 📋 MANDATORY SYSTEM SCHEMA: Maps your exact list of 21 telemetry columns in sequence
  const requestedFields = [
    'customerID', 'gender', 'SeniorCitizen', 'Partner', 'Dependents',
    'tenure', 'PhoneService', 'MultipleLines', 'InternetService', 'OnlineSecurity',
    'OnlineBackup', 'DeviceProtection', 'TechSupport', 'StreamingTV', 'StreamingMovies',
    'Contract', 'PaperlessBilling', 'PaymentMethod', 'MonthlyCharges', 'TotalCharges', 'Churn'
  ];

  // Helper function to turn database keys into spacing labels
  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, ' \$1')
      .trim()
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  // Helper function to format data cell text shapes safely
  const formatValue = (key, value) => {
    if (value === null || value === undefined || String(value).trim() === '') {
      return <span className="text-slate-300 italic">None</span>;
    }

    // High contrast accent for Senior Citizen flags
    if (key === 'SeniorCitizen') {
      return String(value) === '1' || value === true ? 'Yes (1)' : 'No (0)';
    }

    // Inject currency symbols on monetary rate cell strings
    if (key === 'MonthlyCharges' || key === 'TotalCharges') {
      const num = Number(value);
      return isNaN(num) ? String(value) : `$${num.toFixed(2)}`;
    }

    // Highlight active churn dropouts cleanly
    if (key === 'Churn' && String(value).trim().toUpperCase() === 'YES') {
      return <span className="text-rose-600 font-black">Yes</span>;
    }

    return String(value);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
      {/* High-Contrast Header Section Title Accent Panel */}
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

      {/* Structured Grid Content Block */}
      <div className="p-6 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {requestedFields.map((fieldKey) => {
            // Read value safely from either exact match or low-case variation frameworks
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

      {/* Footer Meta Tracking Block */}
      <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-400 font-semibold">
        <span>DATABASE SCHEMATIC MAPPING: VERIFIED COMPLETE</span>
        <span className="text-slate-300">|</span>
        <span>STATUS: LIVE CACHE READ</span>
      </div>
    </div>
  );
}
