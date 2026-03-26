import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import AddButton from "../components/AddButton"
import ConfirmDialog from "../components/ConfirmDialog";
import StatsCard from "../components/StatsCard";
import ServerTable from "../components/server/ServerTable";
import DashboardLayout from "../components/dashboard/DashboardLayout";

const Dashboard = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    serverId: null,
    serverName: "",
  });
  const seenAlertKeys = useRef(new Set());
  const initializedAlerts = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServers({ showLoader: true });
    fetchAlerts({ initialize: true });
    const interval = setInterval(() => fetchServers(), 3000);
    const alertInterval = setInterval(() => fetchAlerts(), 1500);

    return () => {
      clearInterval(interval);
      clearInterval(alertInterval);
    };
  }, []);

  const getAlertKey = (alert) => {
    if (alert?.id !== undefined && alert?.id !== null) return `id-${alert.id}`;
    if (alert?.alertId !== undefined && alert?.alertId !== null) return `alert-${alert.alertId}`;

    return [
      alert?.serverId ?? alert?.serverName ?? "unknown-server",
      alert?.alertType ?? "unknown-type",
      alert?.createdAt ?? "unknown-time",
      alert?.message ?? "",
    ].join("|");
  };

  const fetchAlerts = async ({ initialize = false } = {}) => {
    try {
      const response = await api.get("/api/alerts");
      const alerts = Array.isArray(response.data) ? response.data : [];
      const keysInResponse = alerts.map(getAlertKey);

      if (initialize || !initializedAlerts.current) {
        seenAlertKeys.current = new Set(keysInResponse);
        initializedAlerts.current = true;
        return;
      }

      const newAlerts = alerts.filter((alert) => !seenAlertKeys.current.has(getAlertKey(alert)));
      if (newAlerts.length > 0) {
        newAlerts.forEach((alert) => seenAlertKeys.current.add(getAlertKey(alert)));

        const latestAlert = newAlerts[newAlerts.length - 1];
        const alertKey = getAlertKey(latestAlert);
        toast.error(`New ${latestAlert?.alertType || "Alert"} on ${latestAlert?.serverName || "server"}. Click to view alerts.`, {
          toastId: alertKey,
          autoClose: 5000,
          closeOnClick: true,
          onClick: () => navigate("/alerts"),
        });
        return;
      }

      keysInResponse.forEach((key) => seenAlertKeys.current.add(key));
    } catch {
      // Toast for alerts should not block dashboard usage if alert polling fails.
    }
  };

  const fetchServers = async ({ showLoader = false } = {}) => {
    if (showLoader) setLoading(true);

    try {
      const response = await api.get("/api/servers");
      const serverData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      setServers(serverData);
      setError("");
    } catch (err) {
      console.log(err)
      setError("Failed to fetch servers: " + (err?.message || err));
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = servers.length;
    const active = servers.filter((s) => s.status?.toLowerCase() === "active").length;
    const inactive = servers.filter((s) => s.status?.toLowerCase() === "inactive").length;
    const blocked = servers.filter((s) => s.status?.toLowerCase() === "blocked").length;
    return { total, active, inactive, blocked };
  }, [servers]);

  /**
   *  const which change it value when Server or searchTerm change
   */
  const filteredServers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return servers;
    return servers.filter(
      (server) =>
        server.serverName?.toLowerCase().includes(term) ||
        server.ipAddress?.toLowerCase().includes(term) ||
        server.osType?.toLowerCase().includes(term) ||
        server.webServerType?.toLowerCase().includes(term) ||
        server.webServerPortNo?.toLowerCase().includes(term)
    );
  }, [servers, searchTerm]);

  const handleDeleteServer = (serverId, serverName) => {
    setDeleteDialog({ isOpen: true, serverId, serverName });
  };

  const confirmDelete = async () => {
    const { serverId } = deleteDialog;
    try {
      await api.delete(`/api/servers/${serverId}`);
      setServers((prev) => prev.filter((s) => (s.id || s._id || s.serverId) !== serverId));
      setDeleteDialog({ isOpen: false, serverId: null, serverName: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete server. Please try again.");
    }
  };

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-6">
          <div className="rounded-2xl p-8 bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-sky-500 border-t-transparent mx-auto mb-4" />
            <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">Loading your dashboard...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      
      <DashboardLayout>

        <div className=" bg-slate-100 dark:bg-slate-950 transition-colors">
         
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              {/* dashboard title */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Admin Server Dashboard</h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Visualize system health, manage servers and keep configurations under control with a modern admin UI.</p>
              </div>
              {/* add server button :- To Do - create buuton component addserver - reuseability :- DONE*/}
              <AddButton
                title="New Server"
                onClick={() => navigate("/add-server")}
                variant="primary"
                size="lg"
                icon="+"
                className=""
              />

            </div>

            {error && (
              <div className="mb-6 rounded-lg px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">{error}</div>
            )}

            {/* server stats card To Do :- icon change from # ->  */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard title="Total Servers" value={stats.total} variant="primary" icon="#" />
              <StatsCard title="Active Servers" value={stats.active} variant="success" icon="#" />
              <StatsCard title="Inactive Servers" value={stats.inactive} variant="danger" icon="#" />
              <StatsCard title="Unknown Servers" value={stats.blocked} variant="subtle" icon="#" />
            </div>

            {/* ServeTable component :- show list of server  */}
            <ServerTable
              servers={filteredServers}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onView={(id) => navigate(`/servers/${id}`)}
              onDelete={handleDeleteServer}
              onAdd={() => navigate("/add-server")}
            />
          </div>
        

        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, serverId: null, serverName: "" })}
          onConfirm={confirmDelete}
          title="Delete Server"
          message={`Are you sure you want to delete ${deleteDialog.serverName || "this server"}?`}
          serverName={deleteDialog.serverName}
        />
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
