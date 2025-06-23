import { useState, useEffect } from 'react';
import axios from 'axios';

export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios(url, options);
      setData(response.data);
    } catch (err) {
      setError(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, error };
};
