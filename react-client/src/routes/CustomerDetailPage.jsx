import React, { useState, useEffect } from 'react';
import { customersApi } from '../api/customersApi';
import CustomerProfileCard from '../components/customerDetail/CustomerProfileCard';
import RiskBreakdownCard from '../components/customerDetail/RiskBreakdownCard';
import OutreachStatusPanel from '../components/customerDetail/OutreachStatusPanel';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function CustomerDetailPage({ customerId, onBack }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState(null);
  const [syncState, setSyncState] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

  // Fetch target profile on component initialization or key changes
  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      setLoading(true);
      setServerError(null);
      try {
        const data = await customersApi.getById(customerId);
        if (isMounted) {
          setCustomer(data);
        }
      } catch (err) {
        if (isMounted) {
          setServerError(err.message || 'The requested customer profile could not be loaded.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (customerId) {
      loadProfile();
    }
  }, [customerId]);

    const handleOutreachSave = async (targetMachineState) => {
    setSyncState('loading');

    const activeId = customer?.customerID || customerId;

    try {
      const response = await fetch(`http://localhost:8000/api/customers/${activeId}/outreach/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: targetMachineState }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server rejected transition step.');
      }

      const updatedData = await response.json();

      setCustomer(prev => ({
        ...prev,
        OutreachStatus: updatedData.new_status
      }));

      setSyncState('success');
      setTimeout(() => setSyncState('idle'), 2000);
    } catch (err) {
      setSyncState('error');
    }
  };


  // 1. ACTIVE SERVER RUNTIME LOADING INTERFACE
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <LoadingSpinner />
        <p className="text-sm font-semibold text-slate-500 animate-pulse">
          Querying memory storage matrix for account {customerId}...
        </p>
      </div>
    );
  }

  // 2. ERROR STATE ESCAPE ROUTE INTERFACE
  if (serverError) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-lg space-y-6 text-center animate-fade-in">
        <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto">
          <span className="text-rose-600 font-bold text-lg">!</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Account Access Exception
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            {serverError}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 max-w-sm mx-auto">
          <button
            onClick={onBack}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-md transition-all duration-150 active:scale-95 cursor-pointer"
          >
            Return to Directory Workspace
          </button>
        </div>
      </div>
    );
  }

  // 3. SECURE RECOVERY STATE CASE FALLBACK
  if (!customer) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Dynamic Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <button
            onClick={onBack}
            className="text-xs font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-wider transition-colors flex items-center gap-1 group cursor-pointer mb-1"
          >
            <span className="transform group-hover:-translate-x-0.5 transition-transform inline-block">←</span>
            Back to Directory
          </button>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Profile Analysis Explorer
          </h1>
        </div>

        <div className="bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-700">
          Account Pointer: {customer.customerID}
        </div>
      </div>

      {/* Structured Dual-Column Master Operational Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Hand Core Diagnostics Column Block */}
        <div className="lg:col-span-2 space-y-6">
          <CustomerProfileCard customer={customer} />
        </div>

        {/* Right Hand Tool & State Machine Widget Sidebar Block */}
        <div className="space-y-6">
          <OutreachStatusPanel
            currentStatus={customer.OutreachStatus}
            onSave={handleOutreachSave}
            syncState={syncState}
          />
          <RiskBreakdownCard customer={customer} />
        </div>
      </div>
    </div>
  );
}
