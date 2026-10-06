// import React, { useState } from 'react';
//
// export default function FiltersBar({ risk, onRiskChange, status, onStatusChange, onManualQuery }) {
//   const [localId, setLocalId] = useState('');
//
//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     if (localId.trim()) {
//       onManualQuery(localId.trim());
//     }
//   };
//
//   return (
//     <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
//       <form onSubmit={handleFormSubmit} className="w-full lg:w-auto flex gap-2">
//         <div className="relative w-full sm:w-80">
//           <input
//             type="text"
//             placeholder="Query unique account ID..."
//             value={localId}
//             onChange={(e) => setLocalId(e.target.value)}
//             className="w-full px-4 py-2 bg-slate-50 hover:bg-slate-100/70 text-slate-900 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium placeholder-slate-400"
//           />
//         </div>
//         <button
//           type="submit"
//           className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all tracking-wide whitespace-nowrap active:scale-95"
//         >
//           Query Record
//         </button>
//       </form>
//
//       <div className="flex flex-col sm:flex-row w-full lg:w-auto items-center gap-3">
//         <div className="w-full sm:w-auto flex items-center gap-2">
//           <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">Risk:</span>
//           <select
//             value={risk}
//             onChange={(e) => onRiskChange(e.target.value)}
//             className="w-full sm:w-48 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
//           >
//             <option value="All">All Triage Tiers</option>
//             <option value="High Risk">High Risk Allocation</option>
//             <option value="Medium Risk">Medium Risk Allocation</option>
//             <option value="Low Risk">Low Risk Allocation</option>
//           </select>
//         </div>
//
//         <div className="w-full sm:w-auto flex items-center gap-2">
//           <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">Status:</span>
//           <select
//             value={status}
//             onChange={(e) => onStatusChange(e.target.value)}
//             className="w-full sm:w-48 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
//           >
//             <option value="All">All Outreach States</option>
//             <option value="Not Contacted">Uncontacted Queue</option>
//             <option value="Pending Follow-up">Pending Action</option>
//             <option value="Retention Secured">Secured Account</option>
//             <option value="Account Churned">Lost Portfolio</option>
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from 'react';

export default function FiltersBar({ search, onSearchChange, risk, onRiskChange, status, onStatusChange, contract, onContractChange }) {
  const riskOptions = ['All', 'High Risk', 'Medium Risk', 'Low Risk', 'Churned'];
  const statusOptions = ['All', 'Not Contacted', 'In Progress', 'Resolved'];
  const contractOptions = ['All', 'Month-to-month', 'One year', 'Two year'];

  return (
    <div className="flex flex-col xl:flex-row items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">

        {/* 🔍 RESTORED SEARCH COMPONENT FIELD */}
        <div className="flex flex-col gap-1 min-w-[200px] flex-1 sm:flex-initial">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            Search Customer ID
          </label>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="e.g. 7590-VHVEG..."
              className="w-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:border-slate-900 focus:bg-white placeholder-slate-300"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Risk Evaluation Dropdown Selector */}
        <div className="flex flex-col gap-1 min-w-[140px] flex-1 sm:flex-initial">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            Risk Classification
          </label>
          <select
            value={risk}
            onChange={(e) => onRiskChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors focus:outline-none focus:border-slate-900"
          >
            {riskOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* State Machine Outreach Dropdown Selector */}
        <div className="flex flex-col gap-1 min-w-[140px] flex-1 sm:flex-initial">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            Outreach Phase
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors focus:outline-none focus:border-slate-900"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Contract Type Dropdown Selector */}
        <div className="flex flex-col gap-1 min-w-[140px] flex-1 sm:flex-initial">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            Contract Duration
          </label>
          <select
            value={contract}
            onChange={(e) => onContractChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors focus:outline-none focus:border-slate-900"
          >
            {contractOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

      </div>

      <div className="text-[11px] text-slate-400 font-semibold italic bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60 w-full xl:w-auto text-center xl:text-right">
        💡 High Risk queues are prioritized at the top of the board.
      </div>
    </div>
  );
}
