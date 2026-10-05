import React from 'react';
import CustomerRow from './CustomerRow';

export default function CustomerTable({ customers, onCustomerClick }) {
  return (
    <div className="rounded-xl border border-slate-200 shadow-md overflow-hidden bg-slate-50 transition-all duration-200 hover:shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 border-b border-slate-800 text-[11px] font-bold tracking-widest text-slate-300 uppercase">
              <th className="px-6 py-4">Account ID</th>
              <th className="px-6 py-4">Risk Evaluation</th>
              <th className="px-6 py-4">Contract Variant</th>
              <th className="px-6 py-4">Tenure Duration</th>
              <th className="px-6 py-4">Monthly Rate</th>
              <th className="px-6 py-4">Operational Status</th>
            </tr>
          </thead>

          <tbody className="bg-white [&_tr:nth-child(even)]:bg-slate-100/70 divide-y divide-slate-200/60 text-sm">
            {customers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center text-slate-400 font-medium bg-slate-50/50">
                  No managed portfolios matched the active query filter parameters.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <CustomerRow
                  key={customer.customerID}
                  customer={customer}
                  onClick={onCustomerClick}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
