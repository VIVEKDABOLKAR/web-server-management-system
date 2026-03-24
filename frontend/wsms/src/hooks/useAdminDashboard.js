import { useEffect, useState } from "react";
import api from "../services/api";

const useAdminDashboard = () => {
  const [servers, setServers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        const [serversRes, usersRes] = await Promise.allSettled([
          api.get("/api/admin/servers"),
          api.get("/api/admin/users"),
        ]);

        const serversData =
          serversRes.status === "fulfilled"
            ? serversRes.value.data
            : (await api.get("/api/servers")).data;

        const usersData =
          usersRes.status === "fulfilled"
            ? usersRes.value.data
            : [(await api.get("/api/users/profile")).data];

        setServers(Array.isArray(serversData) ? serversData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load admin dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { servers, users, loading, error };
};

export default useAdminDashboard;