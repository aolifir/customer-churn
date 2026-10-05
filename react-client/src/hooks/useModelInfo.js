import { useState, useEffect } from 'react';
import { modelApi } from '../api/modelApi';

export const useModelInfo = () => {
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModelInfo = async () => {
      try {
        const data = await modelApi.getInfo();
        setModelInfo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchModelInfo();
  }, []);

  return { modelInfo, loading, error };
};
