// hooks/useServers.js
import { useEffect, useState } from "react";
import api from "../services/api";

const useServers = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      const res = await api.get("/api/servers");
      setServers(res.data?.data || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteServer = async (id) => {
    await api.delete(`/api/servers/${id}`);
    setServers((prev) => prev.filter((s) => s.id !== id));
  };

  return { servers, loading, deleteServer, refresh: fetchServers };
};

export default useServers;