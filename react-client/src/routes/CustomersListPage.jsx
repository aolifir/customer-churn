// import React, { useState, useMemo, useEffect } from 'react';
// import { useCustomers } from '../hooks/useCustomers';
// import FiltersBar from "../components/customers/FiltersBar";
// import CustomerTable from "../components/customers/CustomerTable";
// import LoadingSkeleton from "../components/ui/LoadingSkeleton";
// import ErrorMessage from "../components/ui/ErrorMessage";
//
// export default function CustomersListPage({ onNavigate }) {
//   const { customers, loading, error, refetch } = useCustomers();
//   const [risk, setRisk] = useState('All');
//   const [status, setStatus] = useState('All');
//
//   // 🚀 PAGINATION STATE: Keeps track of the active data window boundary layer
//   const [currentPage, setCurrentPage] = useState(1);
//   const ITEMS_PER_PAGE = 50;
//
//   // Defensive Design rule: Automatically reset back to page 1 if an agent changes drop-down filter metrics
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [risk, status]);
//
//   // 1. Process Master Backend Array Filtering & Strategic Sorting Pipelines
//   const processedCustomers = useMemo(() => {
//     let output = [...customers];
//
//     if (risk !== 'All') {
//       output = output.filter(c => c.Churn_Risk_Tier === risk);
//     }
//
//     if (status !== 'All') {
//       output = output.filter(c => (c.OutreachStatus || 'Not Contacted') === status);
//     }
//
//     const triageScores = {
//       'High Risk': 1,
//       'Medium Risk': 2,
//       'Low Risk': 3,
//       'Churned': 4
//     };
//
//     output.sort((a, b) => triageScores[a.Churn_Risk_Tier] - triageScores[b.Churn_Risk_Tier]);
//
//     return output;
//   }, [customers, risk, status]);
//
//   // 2. 🚀 PAGINATION CALCULATION ENGINE: Dynamically slice data matching active page limits
//   const paginatedSubset = useMemo(() => {
//     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//     const endIndex = startIndex + ITEMS_PER_PAGE;
//     return processedCustomers.slice(startIndex, endIndex);
//   }, [processedCustomers, currentPage]);
//
//   // Pagination Control Threshold Limits Flags
//   const totalPages = Math.max(1, Math.ceil(processedCustomers.length / ITEMS_PER_PAGE));
//   const hasPrevious = currentPage > 1;
//   const hasNext = currentPage < totalPages;
//
//   if (error) {
//     return (
//       <div className="space-y-4">
//         <ErrorMessage
//           message={error}
//           onRetry={async () => {
//             try {
//               await refetch();
//             } catch (retryException) {
//               window.location.reload();
//             }
//           }}
//         />
//         <div className="text-center max-w-md mx-auto pt-2">
//           <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
//             Network Pipeline Timeout? You can bypass system cache locks by running a hard browser workspace flush.
//           </p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-3 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black tracking-wider uppercase rounded-lg shadow-sm transition-all duration-150 active:scale-95 cursor-pointer"
//           >
//             Force Clear Server Connection Bridge
//           </button>
//         </div>
//       </div>
//     );
//   }
//
//   return (
//     <div className="space-y-8 animate-fade-in">
//       {/* Console Monitoring Summary Status Header Bar */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-6 gap-4">
//         <div>
//           <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">Operational Console</span>
//           <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
//             Customer Triage Dashboard
//           </h1>
//           <p className="text-sm text-slate-500 mt-1">
//             Analyze recent portfolio profiles and process high-volatility accounts.
//           </p>
//         </div>
//         <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-6">
//           <div className="text-center">
//             <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Total Directory: </span>
//             <span className="text-lg font-bold text-slate-800">{customers.length}</span>
//           </div>
//           <div className="h-8 w-px bg-slate-200" />
//           <div className="text-center">
//             <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Filtered Subset: </span>
//             <span className="text-lg font-bold text-slate-800">{processedCustomers.length}</span>
//           </div>
//         </div>
//       </div>
//
//       {/* Sorting Control Row Panel */}
//       <div className="bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
//         <FiltersBar
//           risk={risk} onRiskChange={setRisk}
//           status={status} onStatusChange={setStatus}
//           onManualQuery={onNavigate}
//         />
//       </div>
//
//       {/* Primary Data Directory Content Block */}
//       {loading ? (
//         <LoadingSkeleton />
//       ) : (
//         <div className="space-y-4 transition-all duration-300 transform">
//           <CustomerTable
//             customers={paginatedSubset}
//             onCustomerClick={onNavigate}
//           />
//
//           {/* 🚀 OPERATIONAL PAGINATION INTERFACE TOOLBAR CONTAINER */}
//           <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
//             <div className="text-xs font-semibold text-slate-500 tracking-wide order-2 sm:order-1">
//               Showing row indices <span className="font-bold text-slate-800">{processedCustomers.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
//               <span className="font-bold text-slate-800">
//                 {Math.min(currentPage * ITEMS_PER_PAGE, processedCustomers.length)}
//               </span>{' '}
//               of <span className="font-bold text-slate-900">{processedCustomers.length}</span> matching target profiles.
//             </div>
//
//             {/* Action Buttons Step Controllers Wrapper */}
//             <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
//               <button
//                 type="button"
//                 disabled={!hasPrevious}
//                 onClick={() => setCurrentPage(prev => prev - 1)}
//                 className={`flex-1 sm:flex-initial text-center px-4 py-2.5 rounded-lg border text-xs font-black tracking-wider uppercase transition-all select-none ${
//                   hasPrevious
//                     ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm cursor-pointer active:scale-95'
//                     : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed opacity-60'
//                 }`}
//               >
//                 ← Previous 50
//               </button>
//
//               <div className="px-3 text-center text-xs font-mono font-bold text-slate-800 bg-slate-100 border border-slate-200 rounded-md py-1.5 shadow-inner min-w-[75px]">
//                 {currentPage} / {totalPages}
//               </div>
//
//               <button
//                 type="button"
//                 disabled={!hasNext}
//                 onClick={() => setCurrentPage(prev => prev + 1)}
//                 className={`flex-1 sm:flex-initial text-center px-4 py-2.5 rounded-lg border text-xs font-black tracking-wider uppercase transition-all select-none ${
//                   hasNext
//                     ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm cursor-pointer active:scale-95'
//                     : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed opacity-60'
//                 }`}
//               >
//                 Next 50 →
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useMemo, useEffect } from 'react';
import { useCustomers } from '../hooks/useCustomers';
import FiltersBar from "../components/customers/FiltersBar";
import CustomerTable from "../components/customers/CustomerTable";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import ErrorMessage from "../components/ui/ErrorMessage";

export default function CustomersListPage({ onNavigate }) {
  const { customers, loading, error, refetch } = useCustomers();
  const [risk, setRisk] = useState('All');
  const [status, setStatus] = useState('All');
  const [contract, setContract] = useState('All');
  const [search, setSearch] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  useEffect(() => {
    setCurrentPage(1);
  }, [risk, status, contract, search]);

  const processedCustomers = useMemo(() => {
    let output = [...customers];

    if (search && search.trim() !== '') {
      output = output.filter(c =>
        c.customerID && c.customerID.toLowerCase().includes(search.toLowerCase().trim())
      );
    }

    if (risk !== 'All') {
      output = output.filter(c => c.Churn_Risk_Tier === risk);
    }

    if (status !== 'All') {
      output = output.filter(c => (c.OutreachStatus || 'Not Contacted') === status);
    }

    if (contract !== 'All') {
      output = output.filter(c => c.Contract === contract);
    }

    const triageScores = {
      'High Risk': 1,
      'Medium Risk': 2,
      'Low Risk': 3,
      'Churned': 4
    };

    output.sort((a, b) => triageScores[a.Churn_Risk_Tier] - triageScores[b.Churn_Risk_Tier]);
    return output;
  }, [customers, search, risk, status, contract]);

  const paginatedSubset = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return processedCustomers.slice(startIndex, endIndex);
  }, [processedCustomers, currentPage]);

  const totalPages = Math.max(1, Math.ceil(processedCustomers.length / ITEMS_PER_PAGE));
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage
          message={error}
          onRetry={async () => {
            try { await refetch(); } catch (e) { window.location.reload(); }
          }}
        />
        <div className="text-center max-w-md mx-auto pt-2">
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black tracking-wider uppercase rounded-lg shadow-sm"
          >
            Force Clear Server Connection Bridge
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">

      {/* 💻 MAIN HEADER CONTROL STRIP */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-200 pb-6 gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">Operational Console</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Customer Triage Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Analyze recent portfolio profiles and process high-volatility accounts.
          </p>
        </div>

        {/* 🚀 ACTION LINK WRAPPER */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => onNavigate('model-info', null)}
            className="px-4 py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100/80 text-xs font-bold tracking-wide uppercase rounded-xl shadow-sm transition-all duration-150 active:scale-95 cursor-pointer"
          >
            🔍 View Model Blueprint
          </button>

          <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 select-none">
            <div className="text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Directory: </span>
              <span className="text-sm font-black text-slate-800">{customers.length}</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div className="text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Filtered: </span>
              <span className="text-sm font-black text-slate-800">{processedCustomers.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sorting Control Row Panel */}
      <div className="bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
        <FiltersBar
          search={search} onSearchChange={setSearch}
          risk={risk} onRiskChange={setRisk}
          status={status} onStatusChange={setStatus}
          contract={contract} onContractChange={setContract}
          onManualQuery={onNavigate}
        />
      </div>

      {/* Primary Data Directory Content Block */}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="space-y-4 transition-all duration-300 transform">
          <CustomerTable
            customers={paginatedSubset}
            onCustomerClick={onNavigate}
          />

          {/* Operational Pagination Interface Toolbar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
            <div className="text-xs font-semibold text-slate-500 tracking-wide order-2 sm:order-1">
              Showing row indices <span className="font-bold text-slate-800">{processedCustomers.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
              <span className="font-bold text-slate-800">
                {Math.min(currentPage * ITEMS_PER_PAGE, processedCustomers.length)}
              </span>{' '}
              of <span className="font-bold text-slate-900">{processedCustomers.length}</span> matching target profiles.
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
              <button
                type="button"
                disabled={!hasPrevious}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className={`flex-1 sm:flex-initial text-center px-4 py-2.5 rounded-lg border text-xs font-black tracking-wider uppercase transition-all ${
                  hasPrevious ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 cursor-pointer' : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed opacity-60'
                }`}
              >
                ← Previous 50
              </button>

              <div className="px-3 text-center text-xs font-mono font-bold text-slate-800 bg-slate-100 border border-slate-200 rounded-md py-1.5 min-w-[75px]">
                {currentPage} / {totalPages}
              </div>

              <button
                type="button"
                disabled={!hasNext}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className={`flex-1 sm:flex-initial text-center px-4 py-2.5 rounded-lg border text-xs font-black tracking-wider uppercase transition-all ${
                  hasNext ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 cursor-pointer' : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed opacity-60'
                }`}
              >
                Next 50 →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

