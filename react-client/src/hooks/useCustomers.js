import { useState, useEffect, useCallback } from 'react';
import { customersApi } from '../api/customersApi';

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await customersApi.getAll();
      // Safe boundary check if payload returns a nested object or a direct array
      const targetArray = Array.isArray(data) ? data : data.results || [];
      setCustomers(targetArray);
    } catch (err) {
      setError('Failed to fetch customer directory records from the Django backend server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return { customers, setCustomers, loading, error, refetch: fetchCustomers };
};
