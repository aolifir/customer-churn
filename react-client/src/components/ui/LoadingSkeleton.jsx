import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="h-10 bg-slate-200 rounded w-full"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-slate-100 rounded w-full"></div>
      ))}
    </div>
  );
}
