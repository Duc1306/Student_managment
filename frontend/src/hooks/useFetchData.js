import { useState, useEffect } from "react";
import api from "../api";

const useFetchData = (endpoint, queryParams = {}) => {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async (params = {}) => {
    try {
      setLoading(true);
      const res = await api.get(endpoint, {
        params: { ...queryParams, ...params },
      });
      setData(res.data.data || res.data); 
      setMeta(res.data.meta || null);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();

  }, []);

  return { data, meta, loading, refetch: fetchData };
};

export default useFetchData;
