import React, { useState, useEffect } from 'react';
import { useCustomers } from '../hooks/useCustomers';
import FiltersBar from "../components/customers/FiltersBar";
import CustomerTable from "../components/customers/CustomerTable";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import ErrorMessage from "../components/ui/ErrorMessage";

export default function CustomersListPage({ onNavigate }) {
  const [risk, setRisk] = useState('All');
  const [status, setStatus] = useState('All');
  const [contract, setContract] = useState('All');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Hook automatically watches filters and requests exactly 50 records from backend
  const { customers, metadata, loading, error, refetch } = useCustomers({
    page: currentPage,
    search,
    risk,
    status,
    contract
  });

  // Reset page counter instantly when users shift search queries or dropdown selections
  useEffect(() => {
    setCurrentPage(1);
  }, [risk, status, contract, search]);

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-200 pb-6 gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">Operational Console</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Customer Triage Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('model-info')}
            className="px-4 py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100/80 text-xs font-bold tracking-wide uppercase rounded-xl shadow-sm transition-all duration-150 active:scale-95 cursor-pointer"
          >
            🔍 View Model Blueprint
          </button>
          <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm text-center select-none">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Total Filtered Matches</span>
            <span className="text-sm font-black text-slate-800">{metadata.total_records}</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
        <FiltersBar
          search={search} onSearchChange={setSearch}
          risk={risk} onRiskChange={setRisk}
          status={status} onStatusChange={setStatus}
          contract={contract} onContractChange={setContract}
          onManualQuery={onNavigate}
        />
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="space-y-4">
          <CustomerTable customers={customers} onCustomerClick={onNavigate} />

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
            <div className="text-xs font-semibold text-slate-500 tracking-wide">
              Showing records for page <span className="font-bold text-slate-800">{metadata.current_page}</span> of <span className="font-bold text-slate-900">{metadata.total_pages}</span>.
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                disabled={!metadata.has_previous}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className={`flex-1 sm:flex-initial text-center px-4 py-2 rounded-lg border text-xs font-black tracking-wider uppercase transition-all ${
                  metadata.has_previous ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 cursor-pointer' : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed opacity-60'
                }`}
              >
                ← Previous
              </button>

              <div className="px-3 text-xs font-mono font-bold text-slate-800 bg-slate-100 border border-slate-200 rounded-md py-1.5">
                {metadata.current_page} / {metadata.total_pages}
              </div>

              <button
                disabled={!metadata.has_next}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className={`flex-1 sm:flex-initial text-center px-4 py-2 rounded-lg border text-xs font-black tracking-wider uppercase transition-all ${
                  metadata.has_next ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 cursor-pointer' : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed opacity-60'
                }`}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
