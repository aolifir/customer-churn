// // import React from 'react';
// //
// // export default function CustomerProfileCard({ customer }) {
// //   const items = [
// //     { label: 'Contract Configuration', value: customer.Contract },
// //     { label: 'Tenure Metrics', value: `${customer.tenure} Months` },
// //     { label: 'Monthly Invoicing Rate', value: `$${customer.MonthlyCharges}` },
// //     { label: 'Accumulated Lifetime Billing', value: `$${customer.TotalCharges || '0.00'}` },
// //     { label: 'Line Architecture', value: `${customer.InternetService || 'None'} Network` },
// //     { label: 'Payment Infrastructure', value: customer.PaymentMethod },
// //   ];
// //
// //   return (
// //     <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
// //       <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Diagnostics</h3>
// //       <div className="grid grid-cols-2 gap-4">
// //         {items.map((item, idx) => (
// //           <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
// //             <span className="text-slate-400 text-xs block mb-0.5">{item.label}</span>
// //             <span className="font-semibold text-slate-800 text-sm truncate block">{item.value}</span>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }
//
// import React from 'react';
//
// export default function CustomerProfileCard({ customer }) {
//   // Graceful numeric formatting helper
//   const formatCurrency = (value) => {
//     if (value === undefined || value === null) return '\$0.00';
//     const num = Number(value);
//     return isNaN(num) ? value : `$${num.toFixed(2)}`;
//   };
//
//   // Structured fields derived exactly from your backend's schema indicators
//   const accountMetrics = [
//     { label: 'Assigned Customer ID', value: customer.customerID, isMono: true },
//     { label: 'Gender Classification', value: customer.gender || 'Not Specified' },
//     {
//       label: 'Senior Citizen Status',
//       value: Number(customer.SeniorCitizen) === 1 ? 'Yes (Age 65+ Indicator)' : 'No'
//     },
//     { label: 'Account Tenure Length', value: `${customer.tenure || 0} Months` },
//     { label: 'Active Internet Configuration', value: customer.InternetService || 'None' },
//     { label: 'Contractual Billing Structure', value: customer.Contract || 'Month-to-month' },
//     { label: 'Transaction Payment Path', value: customer.PaymentMethod || 'Not Provided' },
//     { label: 'Monthly Base Invoicing Rate', value: formatCurrency(customer.MonthlyCharges) },
//     { label: 'Accumulated Lifetime Charges', value: formatCurrency(customer.TotalCharges) },
//   ];
//
//   return (
//     <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
//       <div className="flex items-center justify-between border-b border-slate-100 pb-3">
//         <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
//           🔍 Targeted Profile Analytics
//         </h3>
//         <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
//           System Schema Validated
//         </span>
//       </div>
//
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {accountMetrics.map((metric, index) => (
//           <div
//             key={index}
//             className={`p-3 bg-slate-50 border border-slate-200 rounded-lg transition-all ${
//               metric.isMono ? 'sm:col-span-2 bg-slate-100/50' : ''
//             }`}
//           >
//             <span className="text-slate-400 text-xs font-medium block mb-1">
//               {metric.label}
//             </span>
//             <span className={`text-sm font-semibold text-slate-800 tracking-tight truncate block ${
//               metric.isMono ? 'font-mono text-blue-600' : ''
//             }`}>
//               {metric.value}
//             </span>
//           </div>
//         ))}
//       </div>
//
//       {/* Quick Indicator Sub-Bar for Quick Retention Agent Context */}
//       <div className="pt-2 flex flex-wrap gap-2 border-t border-slate-100 text-xs">
//         <div className="flex items-center gap-1.5 text-slate-500">
//           <span className="font-medium text-slate-700">Phone Service Lines:</span>
//           <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
//             {customer.PhoneService === 'Yes' ? `Active (${customer.MultipleLines || 'Single Line'})` : 'No Connected Line'}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from 'react';

export default function CustomerProfileCard({ customer }) {
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '\$0.00';
    const num = Number(value);
    return isNaN(num) ? value : `$${num.toFixed(2)}`;
  };

  const accountMetrics = [
    { label: 'Assigned Customer ID', value: customer.customerID, isMono: true, fullWidth: true },
    { label: 'Gender Classification', value: customer.gender || 'Not Specified' },
    {
      label: 'Senior Citizen Status',
      value: Number(customer.SeniorCitizen) === 1 ? 'True (Age 65+ Portfolio)' : 'False'
    },
    {
  label: 'Account Tenure Length',
  value: `${customer.tenure || 0} ${Number(customer.tenure) === 1 ? 'Month' : 'Months'}`
},
    { label: 'Active Internet Configuration', value: customer.InternetService || 'None' },
    { label: 'Contractual Billing Structure', value: customer.Contract || 'Month-to-month' },
    { label: 'Transaction Payment Path', value: customer.PaymentMethod || 'Not Provided' },
    { label: 'Monthly Base Invoicing Rate', value: formatCurrency(customer.MonthlyCharges) },
    { label: 'Accumulated Lifetime Charges', value: formatCurrency(customer.TotalCharges) },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block">Profile Target</span>
          <h3 className="text-lg font-bold text-slate-900 mt-0.5">Account Diagnostics</h3>
        </div>
        <span className="text-[11px] bg-slate-100 font-bold text-slate-500 px-3 py-1 rounded-full border border-slate-200 shadow-inner">
          Verified Core Record
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {accountMetrics.map((metric, index) => (
          <div
            key={index}
            className={`p-4 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-200/60 transition-all duration-200 group ${
              metric.fullWidth ? 'sm:col-span-2 bg-slate-100/40 border-slate-200' : ''
            }`}
          >
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1 group-hover:text-slate-500 transition-colors">
              {metric.label}
            </span>
            <span className={`text-sm font-bold text-slate-800 tracking-tight truncate block ${
              metric.isMono ? 'font-mono text-indigo-600 text-base' : ''
            }`}>
              {metric.value}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Phone Line State:</span>
          <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">
            {customer.PhoneService === 'Yes' ? `Active (${customer.MultipleLines || 'Single Line'})` : 'Inactive Line'}
          </span>
        </div>
      </div>
    </div>
  );
}

