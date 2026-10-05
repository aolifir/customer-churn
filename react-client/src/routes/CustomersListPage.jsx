// import React, { useState, useMemo } from 'react';
// import { useCustomers } from '../hooks/useCustomers';
// import FiltersBar from '../components/customers/FiltersBar';
// import CustomerTable from '../components/customers/CustomerTable';
// import LoadingSkeleton from '../components/ui/LoadingSkeleton';
// import ErrorMessage from '../components/ui/ErrorMessage';
//
// export default function CustomersListPage({ onNavigate }) {
//   const { customers, loading, error, refetch } = useCustomers();
//   const [risk, setRisk] = useState('All');
//   const [status, setStatus] = useState('All');
//
//   const filteredAndSortedCustomers = useMemo(() => {
//     let output = [...customers];
//
//     // Filter by Risk Profile
//     if (risk !== 'All') {
//       output = output.filter(c => c.Churn_Risk_Tier === risk);
//     }
//
//     // Filter by Outreach Status
//     if (status !== 'All') {
//       output = output.filter(c => (c.OutreachStatus || 'Not Contacted') === status);
//     }
//
//     // Sort by Risk Priority (High Risk -> Medium Risk -> Low Risk)
//     const triageScores = { 'High Risk': 1, 'Medium Risk': 2, 'Low Risk': 3 };
//     output.sort((a, b) => triageScores[a.Churn_Risk_Tier] - triageScores[b.Churn_Risk_Tier]);
//
//     // Keep the "First 20 Sample" criteria requested by your architecture blueprint
//     return output.slice(0, 20);
//   }, [customers, risk, status]);
//
//   if (error) return <ErrorMessage message={error} onRetry={refetch} />;
//
//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between border-b border-slate-200 pb-4">
//         <div>
//           <h1 className="text-xl font-black text-slate-800 tracking-tight">📊 Telco Churn Risk Intelligence Dashboard</h1>
//           <p className="text-xs text-slate-500 font-medium">📁 System Sample Directory (First 20 Records Ordered by High Risk Priority)</p>
//         </div>
//       </div>
//
//       <FiltersBar
//         risk={risk} onRiskChange={setRisk}
//         status={status} onStatusChange={setStatus}
//         onManualQuery={onNavigate}
//       />
//
//       {loading ? (
//         <LoadingSkeleton />
//       ) : (
//         <CustomerTable
//           customers={filteredAndSortedCustomers}
//           onCustomerClick={onNavigate}
//         />
//       )}
//     </div>
//   );
// }

import React, { useState, useMemo } from 'react';
import { useCustomers } from '../hooks/useCustomers';
import FiltersBar from "../components/customers/FiltersBar";
import CustomerTable from "../components/customers/CustomerTable";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import ErrorMessage from "../components/ui/ErrorMessage";

export default function CustomersListPage({ onNavigate }) {
  const { customers, loading, error, refetch } = useCustomers();
  const [risk, setRisk] = useState('All');
  const [status, setStatus] = useState('All');

  const filteredAndSortedCustomers = useMemo(() => {
    let output = [...customers];

    if (risk !== 'All') {
      output = output.filter(c => c.Churn_Risk_Tier === risk);
    }

    if (status !== 'All') {
      output = output.filter(c => (c.OutreachStatus || 'Not Contacted') === status);
    }

    const triageScores = {
      'High Risk': 1,
      'Medium Risk': 2,
      'Low Risk': 3,
      'Churned': 4
    };

    output.sort((a, b) => triageScores[a.Churn_Risk_Tier] - triageScores[b.Churn_Risk_Tier]);

    return output.slice(0, 20);
  }, [customers, risk, status]);

  // ❌ OLD LINE: (Could get trapped if refetch() fails to clear network socket pipelines)
  // if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  // 🚀 FIXED: Double-layered defense strategy prevents lockup screens completely
  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage
          message={error}
          onRetry={async () => {
            try {
              await refetch();
            } catch (retryException) {
              // Fallback Escape Trigger: If endpoint is still blocked, force a hard reload of application state windows
              window.location.reload();
            }
          }}
        />
        <div className="text-center max-w-md mx-auto pt-2">
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Network Pipeline Timeout? You can bypass system cache locks by running a hard browser workspace flush.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black tracking-wider uppercase rounded-lg shadow-sm transition-all duration-150 active:scale-95 cursor-pointer"
          >
            Force Clear Server Connection Bridge
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-6 gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">Operational Console</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Customer Triage Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Analyze recent portfolio profiles and process high-volatility accounts.
          </p>
        </div>
        <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-6">
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Total Directory: </span>
            <span className="text-lg font-bold text-slate-800">{customers.length}</span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Active Subset: </span>
            <span className="text-lg font-bold text-slate-800">{filteredAndSortedCustomers.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
        <FiltersBar
          risk={risk} onRiskChange={setRisk}
          status={status} onStatusChange={setStatus}
          onManualQuery={onNavigate}
        />
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="transition-all duration-300 transform">
          <CustomerTable
            customers={filteredAndSortedCustomers}
            onCustomerClick={onNavigate}
          />
        </div>
      )}
    </div>
  );
}
