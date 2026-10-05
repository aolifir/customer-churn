import { useState, useCallback } from 'react';
import { outreachApi } from '../api/outreachApi';

export const useUpdateOutreach = () => {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState(null);

  const updateOutreach = useCallback(async (id, tokenState) => {
    setStatus('loading');
    setError(null);
    try {
      // Formats data value to pass over string tokens cleanly to Django
      await outreachApi.updateStatus(id, tokenState);
      setStatus('success');

      // Flash success visual state then settle back to idle
      setTimeout(() => setStatus('idle'), 2000);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to update outreach state.');
      setStatus('error');
      return false;
    }
  }, []);

  const resetStatus = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  return { updateOutreach, status, error, resetStatus };
};
