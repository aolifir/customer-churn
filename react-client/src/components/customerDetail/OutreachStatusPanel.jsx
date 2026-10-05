import React, { useState, useEffect } from 'react';

// Explicit operational machine states
const STATES = {
  NOT_CONTACTED: 'NOT_CONTACTED',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED'
};

// Strict state progression dictionary matrix
const VALID_TRANSITIONS = {
  [STATES.NOT_CONTACTED]: [STATES.IN_PROGRESS],
  [STATES.IN_PROGRESS]: [STATES.NOT_CONTACTED, STATES.RESOLVED],
  [STATES.RESOLVED]: [STATES.IN_PROGRESS] // Allows re-opening if data correction is needed
};

export default function OutreachStatusPanel({ currentStatus, onSave, syncState }) {
  // Translate various potential database text formats safely into core machine tokens
  const normalizeStatus = (status) => {
    if (!status) return STATES.NOT_CONTACTED;
    const clean = String(status).toUpperCase().trim().replace(/[\s-]/g, '_');
    if (clean.includes('PROGRESS') || clean.includes('PENDING')) return STATES.IN_PROGRESS;
    if (clean.includes('SECURED') || clean.includes('CHURNED') || clean.includes('RESOLVED')) return STATES.RESOLVED;
    return STATES.NOT_CONTACTED;
  };

  const [machineState, setMachineState] = useState(() => normalizeStatus(currentStatus));

  // Auto-sync internal layout tracking if the agent clicks a different customer row
  useEffect(() => {
    setMachineState(normalizeStatus(currentStatus));
  }, [currentStatus]);

  const handleStateSelection = (targetState) => {
    const currentState = normalizeStatus(currentStatus);

    // Always allow clicking the currently saved server state
    if (targetState === currentState) {
      setMachineState(targetState);
      return;
    }

    // Check transition validity via state rules
    const allowedTargets = VALID_TRANSITIONS[currentState] || [];
    if (allowedTargets.includes(targetState)) {
      setMachineState(targetState);
    }
  };

  const activeServerState = normalizeStatus(currentStatus);
  const isButtonDisabled = syncState === 'loading' || machineState === activeServerState;

  const getReadableName = (stateToken) => {
    if (stateToken === STATES.NOT_CONTACTED) return 'Not Contacted';
    if (stateToken === STATES.IN_PROGRESS) return 'Outreach In Progress';
    return 'Resolved / Closed';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-5">
      <div>
        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block">Operational Tool</span>
        <h3 className="text-lg font-bold text-slate-900 mt-0.5">Outreach State Machine</h3>
      </div>

      {/* Live System Status Banner */}
      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
        <span className="text-xs text-slate-500 font-semibold">Active Record State:</span>
        <span className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">
          {getReadableName(activeServerState)}
        </span>
      </div>

      {/* Operational Step Selection Block */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
          Select Workflow Transition
        </label>

        <div className="flex flex-col gap-2">
          {Object.values(STATES).map((stateOption) => {
            const isCurrent = activeServerState === stateOption;
            const allowedTargets = VALID_TRANSITIONS[activeServerState] || [];
            const isAllowed = isCurrent || allowedTargets.includes(stateOption);
            const isSelected = machineState === stateOption;

            return (
              <button
                key={stateOption}
                type="button"
                disabled={!isAllowed || syncState === 'loading'}
                onClick={() => handleStateSelection(stateOption)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-bold tracking-wide transition-all duration-150 flex items-center justify-between ${
                  isSelected 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm scale-[1.01]' 
                    : isAllowed
                      ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 cursor-pointer'
                      : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50'
                }`}
              >
                <span>{getReadableName(stateOption)}</span>

                {/* Structural state parameter visual hints */}
                {!isAllowed && (
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-tight bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                    {stateOption === STATES.RESOLVED ? 'Call Required First' : 'Blocked'}
                  </span>
                )}
                {isCurrent && !isSelected && (
                  <span className="text-[10px] text-indigo-600 uppercase font-black tracking-wider">
                    Saved State
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Action Control */}
      <div className="pt-2">
        <button
          onClick={() => onSave(machineState)}
          disabled={isButtonDisabled}
          className={`w-full py-3 px-4 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-150 text-white shadow-md flex items-center justify-center active:scale-95 ${
            syncState === 'success' ? 'bg-emerald-600' :
            syncState === 'error' ? 'bg-rose-600' :
            isButtonDisabled
              ? 'bg-slate-100 text-slate-400 shadow-none cursor-not-allowed border border-slate-200/60'
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
          }`}
        >
          {syncState === 'loading' && <span>Updating Django Datastore...</span>}
          {syncState === 'success' && <span>✓ Transition Logged Successfully</span>}
          {syncState === 'error' && <span>⚠️ Update Failed - Click to Retry</span>}
          {syncState === 'idle' && <span>Commit Selected Transition</span>}
        </button>
      </div>

      {machineState === STATES.NOT_CONTACTED && activeServerState !== STATES.NOT_CONTACTED && (
        <p className="text-[11px] text-amber-700 leading-normal text-center bg-amber-50/50 p-3 rounded-xl border border-amber-200/60 font-medium">
          Note: Moving back to 'Not Contacted' will return this account to the unassigned queue.
        </p>
      )}
    </div>
  );
}
