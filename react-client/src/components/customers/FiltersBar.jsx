import React from 'react';

export default function FiltersBar({ search, onSearchChange, risk, onRiskChange, status, onStatusChange, contract, onContractChange }) {
  const riskOptions = ['All', 'High Risk', 'Medium Risk', 'Low Risk', 'Churned'];
  const statusOptions = ['All', 'Not Contacted', 'In Progress', 'Resolved'];
  const contractOptions = ['All', 'Month-to-month', 'One year', 'Two year'];

  return (
    <div className="flex flex-col xl:flex-row items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">

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
