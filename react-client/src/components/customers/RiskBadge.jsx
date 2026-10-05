import React from 'react';

export default function RiskBadge({ tier }) {
  const styles = {
    'High Risk': {
      bg: 'bg-rose-50/60 text-rose-700 border-rose-200/80',
      dot: 'bg-rose-500'
    },
    'Medium Risk': {
      bg: 'bg-amber-50/60 text-amber-700 border-amber-200/80',
      dot: 'bg-amber-500'
    },
    'Low Risk': {
      bg: 'bg-emerald-50/60 text-emerald-700 border-emerald-200/80',
      dot: 'bg-emerald-500'
    },
    'Churned': {
      bg: 'bg-slate-100 text-slate-600 border-slate-300',
      dot: 'bg-slate-400'
    }
  };

  const current = styles[tier] || { bg: 'bg-slate-50 text-slate-600 border-slate-200', dot: 'bg-slate-400' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${current.bg} tracking-wide transition-all shadow-sm`}>
      <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
      {tier || 'Unassigned'}
    </span>
  );
}
