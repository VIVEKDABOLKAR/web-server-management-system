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
      const [serversRes, usersRes] = await Promise.all([
        api.get("/api/admin/servers"),
        api.get("/api/admin/users"),
      ]);

      const safeServers = Array.isArray(serversRes.data) ? serversRes.data : [];
      const safeUsers = Array.isArray(usersRes.data) ? usersRes.data : [];

      const userMap = {};
      safeUsers.forEach((user) => {
        userMap[user.id] = user.username;
      });

      const serversWithUsername = safeServers.map((server) => ({
        ...server,
        username: userMap[server.userId] || "Unknown",
      }));

      setServers(serversWithUsername);
      setUsers(safeUsers);

    } catch (err) {
      if (err.response?.status === 403) {
        setError("Unauthorized: Admin access required");
      } else {
        setError("Failed to load admin dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);

  return { servers, users, loading, error };
};

export default useAdminDashboard;