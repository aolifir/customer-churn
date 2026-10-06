import React from 'react';
import RiskBadge from './RiskBadge';

export default function CustomerRow({ customer, onClick, rowBg }) {
  const getStatusBadge = (status) => {
    const base = "px-2.5 py-0.5 rounded text-xs font-bold border tracking-wide ";
    if (status === 'Retention Secured') return `${base} bg-emerald-50 text-emerald-700 border-emerald-200`;
    if (status === 'Account Churned') return `${base} bg-slate-200 text-slate-600 border-slate-300`;
    if (status === 'Pending Follow-up') return `${base} bg-blue-50 text-blue-700 border-blue-200`;
    return `${base} bg-slate-100 text-slate-400 border-slate-200 italic font-medium`;
  };

  return (
    <tr
      onClick={() => onClick(customer.customerID)}
      /*
        The negative offset (-outline-offset-2) pins the sharp border internally inside the cell boundaries.
        This completely prevents the data columns from shifting or stuttering on mouse hover.
      */
      className={`
        ${rowBg || 'bg-white'} 
        hover:bg-indigo-50/40 
        hover:outline 
        hover:outline-2 
        hover:outline-slate-900 
        hover:-outline-offset-2 
        transition-all 
        duration-75 
        cursor-pointer 
        group
      `}
    >
      <td className="px-6 py-4 font-mono font-bold text-slate-700 group-hover:text-slate-950 transition-colors">
        {customer.customerID}
      </td>
      <td className="px-6 py-4">
        <RiskBadge tier={customer.Churn_Risk_Tier} />
      </td>
      <td className="px-6 py-4 text-slate-600 font-medium">
        {customer.Contract}
      </td>
      <td className="px-6 py-4 text-slate-600 font-semibold">
        {customer.tenure} {Number(customer.tenure) === 1 ? 'month' : 'months'}
      </td>
      <td className="px-6 py-4 text-slate-700 font-bold">
        ${Number(customer.MonthlyCharges || 0).toFixed(2)}
      </td>
      <td className="px-6 py-4">
        <span className={getStatusBadge(customer.OutreachStatus || 'Not Contacted')}>
          {customer.OutreachStatus || 'Not Contacted'}
        </span>
      </td>
    </tr>
  );
}
