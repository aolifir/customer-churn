import React from 'react';

export default function PaginationControls({ current, total, onPageChange }) {
  return (
    <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm">
      <span className="text-xs text-slate-500 font-medium">
        Displaying index frame {current} of {total || 1}
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(Math.max(current - 1, 1))}
          disabled={current === 1}
          className="px-3 py-1.5 border border-slate-200 rounded-md bg-white text-xs font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Backward
        </button>
        <button
          onClick={() => onPageChange(Math.min(current + 1, total))}
          disabled={current === total || total === 0}
          className="px-3 py-1.5 border border-slate-200 rounded-md bg-white text-xs font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Forward
        </button>
      </div>
    </div>
  );
}
