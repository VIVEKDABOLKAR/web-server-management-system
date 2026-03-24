import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import AlertList from "../../components/AlertList";
import BlockedIpList from "../../components/BlockedIpList";
import ConfirmDialog from "../../components/ConfirmDialog";
import ServerInfoCard from "../../components/server/server_details/ServerInfoCard";
import AgentStatusCard from "../../components/server/server_details/AgentStatusCard";
import MetricsOverview from "../../components/server/MetricsOverview";
import PerformanceTrends from "../../components/server/PerformanceTrends";
import MetricsHistoryTable from "../../components/server/server_details/MetricsHistoryTable";

const ServerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [server, setServer] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const metricsTimeRange = 24; // fixed history window in hours
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false });

  useEffect(() => {
    fetchServerDetails();
    fetchMetrics();
    // Refresh metrics every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [id, metricsTimeRange]);

  const fetchServerDetails = async () => {
    try {
      const response = await api.get(`/api/servers/${id}`);
      setServer(response.data);
    } catch (err) {
      setError("Failed to fetch server details");
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await api.get(
        `/api/metrics/server/${id}/recent?hours=${metricsTimeRange}`,
      );
      setMetrics(response.data);
    } catch (err) {
      // Don't set error state to avoid disrupting the UI
    }
  };

  // Get latest metrics from the metrics array
  const latestMetrics = metrics.length > 0 ? metrics[0] : null;

  const handleDeleteServer = () => {
    setDeleteDialog({ isOpen: true });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/servers/${id}`);
      navigate("/dashboard");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to delete server. Please try again.",
      );
    }
  };

  if (loading) {
    return (
      <>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-500 dark:text-gray-400 text-xl">
            Loading server details...
          </div>
        </div>
      </>
    );
  }

  if (error || !server) {
    return (
      <>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
            {error || "Server not found"}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {server.serverName}
            </h1>
            <button
              onClick={handleDeleteServer}
              className="bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 px-4 py-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition text-sm font-medium"
            >
              Delete Server
            </button>
          </div>

          {/* Server Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <ServerInfoCard server={server} />
            <AgentStatusCard server={server} />
          </div>

          {/* Latest Metrics Overview */}
          <MetricsOverview latestMetrics={latestMetrics} />

          {/* Performance Trends Charts */}
          {latestMetrics && (
            <>
              <PerformanceTrends metrics={metrics} />
              <MetricsHistoryTable metrics={metrics} latestMetrics={latestMetrics} />
            </>
          )}

          {/* Alerts and Blocked IPs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AlertList serverId={id} />
            <BlockedIpList serverId={id} />
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false })}
        onConfirm={confirmDelete}
        title="Delete Server"
        message="This action cannot be undone. All metrics, alerts, and blocked IPs associated with this server will be permanently deleted."
        serverName={server.serverName}
      />
    </>
  );
};

export default ServerDetails;
