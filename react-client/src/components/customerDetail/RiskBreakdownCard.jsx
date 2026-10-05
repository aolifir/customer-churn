import React from 'react';

export default function RiskBreakdownCard({ customer, modelInfo }) {
  // Grab the evaluation calculated directly by your churncalc.py backend script
  const backendTier = customer.Churn_Risk_Tier;

  const renderStatusAlert = () => {
    if (backendTier === 'Churned' || String(customer.Churn).trim().toUpperCase() === 'YES') {
      return (
        <div className="p-4 bg-slate-100 border-l-4 border-slate-400 rounded-r-xl border border-y-slate-200 border-r-slate-200 text-xs text-slate-700 font-medium shadow-sm">
          <span className="font-bold text-slate-800 block mb-0.5">Account Inactive</span>
          This customer has already churned from the company. No retention outreach is required.
        </div>
      );
    }

    if (backendTier === 'High Risk') {
      return (
        <div className="p-4 bg-rose-50/50 border-l-4 border-rose-500 rounded-r-xl border border-y-slate-200 border-r-slate-200 text-xs text-rose-900 font-medium leading-relaxed shadow-sm">
          <span className="font-bold text-rose-700 block mb-0.5">High Risk Status</span>
          The system flagged this account due to volatility indicators, such as uncontracted fiber optic service or missing core protection features.
        </div>
      );
    }

    if (backendTier === 'Medium Risk') {
      return (
        <div className="p-4 bg-amber-50/50 border-l-4 border-amber-500 rounded-r-xl border border-y-slate-200 border-r-slate-200 text-xs text-amber-900 font-medium leading-relaxed shadow-sm">
          <span className="font-bold text-amber-700 block mb-0.5">Medium Risk Status</span>
          This account shows mixed risk factors, typically seen with expiring annual options or unattached profiles. Monitor billing changes.
        </div>
      );
    }

    return (
      <div className="p-4 bg-emerald-50/50 border-l-4 border-emerald-500 rounded-r-xl border border-y-slate-200 border-r-slate-200 text-xs text-emerald-900 font-medium shadow-sm">
        <span className="font-bold text-emerald-700 block mb-0.5">Stable Profile</span>
        The account meets long-term loyalty criteria, protected by a two-year contract or high historical tenure.
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Backend Risk Evaluation
        </h3>
      </div>

      {renderStatusAlert()}

      {modelInfo && (
        <div className="pt-2 text-[10px] text-slate-400 font-medium tracking-wide uppercase">
          Model Engine Source: Django API Pipeline
        </div>
      )}
    </div>
  );
}
