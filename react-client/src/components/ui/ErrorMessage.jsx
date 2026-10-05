import React from 'react';
import RetryButton from './RetryButton';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="p-6 max-w-lg mx-auto my-8 bg-red-50 border border-red-200 rounded-xl text-center space-y-4">
      <div className="text-red-600 font-bold text-lg">System Resilience Warning</div>
      <p className="text-sm text-red-700">{message || 'An unexpected failure severed the current workspace context.'}</p>
      {onRetry && <RetryButton onClick={onRetry} />}
    </div>
  );
}
