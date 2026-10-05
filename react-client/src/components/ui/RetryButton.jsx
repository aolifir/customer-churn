import React from 'react';

export default function RetryButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
    >
      Re-verify Pipeline Connection
    </button>
  );
}
