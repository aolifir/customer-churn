import { useState, useEffect, useCallback } from 'react';

export function useCustomers(filters = {}) {
  const [customers, setCustomers] = useState([]);
  const [metadata, setMetadata] = useState({ total_records: 0, total_pages: 1, has_next: false, has_previous: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { page, search, risk, status, contract } = filters;

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {

      let backendStatus = status || 'All';
      if (status === 'Not Contacted') backendStatus = 'NOT_CONTACTED';
      if (status === 'In Progress') backendStatus = 'IN_PROGRESS';
      if (status === 'Resolved') backendStatus = 'RESOLVED';

      let backendRisk = risk || 'All';

      const queryParams = new URLSearchParams({
        page: page || 1,
        search: search || '',
        risk: backendRisk,
        status: backendStatus,
        contract: contract || 'All'
      });

      const response = await fetch(`http://localhost:8000/api/customers/?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Network bridge failed to query server metrics.');

      const payload = await response.json();

      setCustomers(payload.customers);
      setMetadata(payload.metadata);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, risk, status, contract]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return { customers, metadata, loading, error, refetch: fetchCustomers };
}
