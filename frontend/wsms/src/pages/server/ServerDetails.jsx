import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import MetricCard from "../../components/MetricCard";
import MetricsChart from "../../components/MetricsChart";
import CombinedMetricsChart from "../../components/CombinedMetricsChart";
import AlertList from "../../components/AlertList";
import BlockedIpList from "../../components/BlockedIpList";
import ConfirmDialog from "../../components/ConfirmDialog";

const ServerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [server, setServer] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [metricsTimeRange, setMetricsTimeRange] = useState(24); // hours
  const [chartView, setChartView] = useState("individual"); // 'individual' or 'combined'
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
            {/* Server Information */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded shadow border border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-slate-700">
                Server Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    IP Address:
                  </span>
                  <span className="font-mono text-sm bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
                    {server.ipAddress}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    Status:
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      server.status === "active"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {server.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    OS Type:
                  </span>
                  <span className="text-gray-800 dark:text-gray-200">
                    {server.osType?.name || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    Web Server:
                  </span>
                  <span className="text-gray-800 dark:text-gray-200">
                    {server.webServerType?.name || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    Created At:
                  </span>
                  <span className="text-gray-800 dark:text-gray-200">
                    {new Date(server.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {server.description && (
                  <div className="pt-2 border-t border-gray-200 dark:border-slate-700">
                    <span className="text-gray-600 dark:text-gray-400 font-medium block mb-1">
                      Description:
                    </span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {server.description}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Agent Status */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded shadow border border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-slate-700">
                Agent Status
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    Agent Installed:
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      server.agentInstalled
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {server.agentInstalled ? "✓ Installed" : "Not Installed"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    Last Heartbeat:
                  </span>
                  <span className="text-gray-800 dark:text-gray-200">
                    {server.lastHeartbeat
                      ? new Date(server.lastHeartbeat).toLocaleString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Latest Metrics
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setMetricsTimeRange(1)}
                  className={`px-3 py-1 rounded text-sm ${
                    metricsTimeRange === 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600"
                  }`}
                >
                  1h
                </button>
                <button
                  onClick={() => setMetricsTimeRange(6)}
                  className={`px-3 py-1 rounded text-sm ${
                    metricsTimeRange === 6
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600"
                  }`}
                >
                  6h
                </button>
                <button
                  onClick={() => setMetricsTimeRange(24)}
                  className={`px-3 py-1 rounded text-sm ${
                    metricsTimeRange === 24
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600"
                  }`}
                >
                  24h
                </button>
                <button
                  onClick={() => setMetricsTimeRange(168)}
                  className={`px-3 py-1 rounded text-sm ${
                    metricsTimeRange === 168
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600"
                  }`}
                >
                  7d
                </button>
              </div>
            </div>
            {latestMetrics ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                  <MetricCard
                    title="CPU Usage"
                    value={latestMetrics.cpuUsage || 0}
                    unit="%"
                    max={100}
                  />
                  <MetricCard
                    title="Memory Usage"
                    value={latestMetrics.memoryUsage || 0}
                    unit="%"
                    max={100}
                  />
                  <MetricCard
                    title="Disk Usage"
                    value={latestMetrics.diskUsage || 0}
                    unit="%"
                    max={100}
                  />
                  <MetricCard
                    title="Request Count"
                    value={latestMetrics.requestCount || 0}
                    unit=""
                    max={latestMetrics.requestCount || 100}
                  />
                </div>

                {/* Charts Section */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                      Performance Trends
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setChartView("individual")}
                        className={`px-3 py-2 rounded text-sm font-medium transition ${
                          chartView === "individual"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600"
                        }`}
                      >
                        Individual
                      </button>
                      <button
                        onClick={() => setChartView("combined")}
                        className={`px-3 py-2 rounded text-sm font-medium transition ${
                          chartView === "combined"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600"
                        }`}
                      >
                        Combined
                      </button>
                    </div>
                  </div>

                  {chartView === "individual" ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* CPU Chart */}
                      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-5 rounded shadow">
                        <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4">
                          CPU Usage
                        </h3>
                        <MetricsChart metrics={metrics} type="cpu" />
                      </div>

                      {/* Memory Chart */}
                      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-5 rounded shadow">
                        <h3 className="text-lg font-bold text-green-600 dark:text-green-400 mb-4">
                          Memory Usage
                        </h3>
                        <MetricsChart metrics={metrics} type="memory" />
                      </div>

                      {/* Disk Chart */}
                      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-5 rounded shadow">
                        <h3 className="text-lg font-bold text-amber-600 dark:text-amber-400 mb-4">
                          Disk Usage
                        </h3>
                        <MetricsChart metrics={metrics} type="disk" />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-5 rounded shadow">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                        All Metrics Combined
                      </h3>
                      <CombinedMetricsChart metrics={metrics} />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg dark:shadow-slate-900/30 text-center text-gray-500 dark:text-gray-400">
                No metrics available yet. Make sure the agent is running and
                configured properly.
              </div>
            )}
          </div>

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
