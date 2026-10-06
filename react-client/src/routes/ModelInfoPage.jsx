import React, { useState, useEffect } from 'react';

export default function ModelInfoPage({ onBack }) { // 🚀 Accept onBack property handler
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModelData() {
      try {
        const response = await fetch('http://localhost:8000/api/customers/model-info/');
        const data = await response.json();
        setMetadata(data);
      } catch (err) {
        console.error('Failed to parse model rules:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchModelData();
  }, []);

  if (loading) return <div className="p-8 text-xs font-mono font-bold animate-pulse text-slate-400">Loading engine blueprint schema...</div>;
  if (!metadata) return <div className="p-8 text-xs font-bold text-rose-500">Failed to link to the model metadata matrix.</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 animate-fade-in">

      {/* 🚀 BACK LINK CONTROLLER ROW */}
      <div className="border-b border-slate-200 pb-4">
        <button
          onClick={onBack}
          className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors flex items-center gap-1 cursor-pointer mb-2"
        >
          ← Back to Triage Dashboard
        </button>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">{metadata.model_name}</h1>
        <p className="text-xs text-slate-500 mt-1">{metadata.description}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl font-mono text-[10px] font-bold text-slate-600">
        <div>CORE VERSION: <span className="text-slate-900">{metadata.version}</span></div>
        <div>LAST CALIBRATED: <span className="text-slate-900">{metadata.last_updated}</span></div>
        <div>CALIBRATION TYPE: <span className="text-indigo-600">RULE HEURISTIC MATRIX</span></div>
      </div>

      <div className="space-y-6">
        {Object.entries(metadata.risk_tiers).map(([tierName, tierData]) => (
          <div key={tierName} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className={`px-4 py-2.5 font-black uppercase text-xs tracking-wider border-b border-slate-100 flex items-center justify-between ${
              tierName.includes('High') ? 'bg-rose-50 text-rose-700' : 
              tierName.includes('Medium') ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
            }`}>
              <span>{tierName} Logic Blocks</span>
              <span className="text-[10px] font-mono lowercase">Priority Tier #{tierData.priority}</span>
            </div>

            <div className="p-4 space-y-4 divide-y divide-slate-100">
              {tierData.rules.map((rule) => (
                <div key={rule.id} className="pt-4 first:pt-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-900 text-white font-mono text-[9px] font-black px-1.5 py-0.5 rounded">
                      {rule.id}
                    </span>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                      {rule.name}
                    </h4>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-950 shadow-inner">
                    <code className="text-[11px] font-mono font-bold text-indigo-300 block break-words select-all">
                      IF ({rule.condition}) → SET {tierName.toUpperCase()}
                    </code>
                  </div>

                  <p className="text-[11px] font-semibold text-slate-500 italic pl-1 leading-relaxed">
                    💡 <span className="underline">Business Rationale:</span> {rule.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
