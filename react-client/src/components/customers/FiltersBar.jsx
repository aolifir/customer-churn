// import React, { useState } from 'react';
//
// export default function FiltersBar({ search, onSearchChange, risk, onRiskChange, status, onStatusChange, onManualQuery }) {
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
//       {/* Django Absolute ID Target Search Field */}
//       <form onSubmit={handleFormSubmit} className="w-full lg:w-auto flex gap-2">
//         <input
//           type="text"
//           placeholder="Lookup Customer ID (e.g., 7590-VHVEG)..."
//           value={localId}
//           onChange={(e) => setLocalId(e.target.value)}
//           className="px-3 py-2 border border-slate-300 rounded-lg text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-slate-800 text-black bg-white"
//         />
//         <button
//           type="submit"
//           className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap"
//         >
//           Query Record
//         </button>
//       </form>
//
//       <div className="flex flex-col sm:flex-row w-full lg:w-auto items-center gap-3">
//         <select
//           value={risk}
//           onChange={(e) => onRiskChange(e.target.value)}
//           className="w-full sm:w-auto px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-slate-800"
//         >
//           <option value="All">All Triage Categories</option>
//           <option value="High Risk">🔴 High Risk</option>
//           <option value="Medium Risk">🟡 Medium Risk</option>
//           <option value="Low Risk">🟢 Low Risk</option>
//         </select>
//         <select
//           value={status}
//           onChange={(e) => onStatusChange(e.target.value)}
//           className="w-full sm:w-auto px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-slate-800"
//         >
//           <option value="All">All Outreach States</option>
//           <option value="Not Contacted">Uncontacted</option>
//           <option value="Pending Follow-up">Pending Action</option>
//           <option value="Retention Secured">Secured Portfolio</option>
//           <option value="Account Churned">Lost Accounts</option>
//         </select>
//       </div>
//     </div>
//   );
// }
import React, { useState } from 'react';

export default function FiltersBar({ risk, onRiskChange, status, onStatusChange, onManualQuery }) {
  const [localId, setLocalId] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (localId.trim()) {
      onManualQuery(localId.trim());
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
      <form onSubmit={handleFormSubmit} className="w-full lg:w-auto flex gap-2">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Query unique account ID..."
            value={localId}
            onChange={(e) => setLocalId(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 hover:bg-slate-100/70 text-slate-900 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium placeholder-slate-400"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all tracking-wide whitespace-nowrap active:scale-95"
        >
          Query Record
        </button>
      </form>

      <div className="flex flex-col sm:flex-row w-full lg:w-auto items-center gap-3">
        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">Risk:</span>
          <select
            value={risk}
            onChange={(e) => onRiskChange(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
          >
            <option value="All">All Triage Tiers</option>
            <option value="High Risk">High Risk Allocation</option>
            <option value="Medium Risk">Medium Risk Allocation</option>
            <option value="Low Risk">Low Risk Allocation</option>
          </select>
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">Status:</span>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
          >
            <option value="All">All Outreach States</option>
            <option value="Not Contacted">Uncontacted Queue</option>
            <option value="Pending Follow-up">Pending Action</option>
            <option value="Retention Secured">Secured Account</option>
            <option value="Account Churned">Lost Portfolio</option>
          </select>
        </div>
      </div>
    </div>
  );
}
