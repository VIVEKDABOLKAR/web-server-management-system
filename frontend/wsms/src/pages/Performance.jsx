import { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import MetricCard from "../components/MetricCard";
import MetricsChart from "../components/MetricsChart";
import CombinedMetricsChart from "../components/CombinedMetricsChart";

const Performance = () => {
  const [servers, setServers] = useState([]);
  const [serverMetrics, setServerMetrics] = useState({}); // { serverId: [metrics] }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [metricsTimeRange, setMetricsTimeRange] = useState(24); // hours
  const [chartView, setChartView] = useState("individual"); // 'individual' or 'combined'

  useEffect(() => {
    fetchAllServersAndMetrics();
    const interval = setInterval(fetchAllServersAndMetrics, 30000);
    return () => clearInterval(interval);
  }, [metricsTimeRange]);

  const fetchAllServersAndMetrics = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch all servers for the user
      const serversRes = await api.get("/api/servers");
      setServers(serversRes.data);
      // Fetch metrics for each server
      const metricsObj = {};
      await Promise.all(
        serversRes.data.map(async (server) => {
          try {
            const metricsRes = await api.get(
              `/api/metrics/server/${server.id}/recent?hours=${metricsTimeRange}`,
            );
            metricsObj[server.id] = metricsRes.data;
          } catch (err) {
            metricsObj[server.id] = [];
          }
        }),
      );
      setServerMetrics(metricsObj);
    } catch (err) {
      setError("Failed to fetch metrics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-xl text-gray-500">Loading...</div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-xl text-red-500">{error}</div>;
  }

  if (servers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col items-center justify-center h-full">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
            Performance Metrics
          </h1>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg text-center text-gray-500 dark:text-gray-400">
            <div className="text-6xl mb-2">📊</div>
            <p>
              No servers found.
              <br />
              Add a server to view metrics.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render latest metrics for each server
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
          Performance Metrics
        </h1>
        {servers.map((server) => {
          const metrics = serverMetrics[server.id] || [];
          const latestMetrics = metrics.length > 0 ? metrics[0] : null;
          return (
            <div key={server.id} className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">
                {server.serverName} ({server.ipAddress})
              </h2>
              {metrics.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg text-center text-gray-500 dark:text-gray-400 mb-8">
                  <div className="text-6xl mb-2">📊</div>
                  <p>
                    No metrics available yet for this server.
                    <br />
                    Make sure the agent is running and configured properly.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <MetricCard
                    title="CPU Usage"
                    value={latestMetrics.cpuUsage || 0}
                    unit="%"
                    max={100}
                  />
                  <MetricCard
                    title="Load Avg (1m)"
                    value={latestMetrics.loadAvg1m || 0}
                    unit=""
                    max={latestMetrics.loadAvg1m || 10}
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
                    title="Disk Reads/s"
                    value={latestMetrics.diskReadPerSec || 0}
                    unit="B/s"
                    max={latestMetrics.diskReadPerSec || 100}
                  />
                  <MetricCard
                    title="Disk Writes/s"
                    value={latestMetrics.diskWritePerSec || 0}
                    unit="B/s"
                    max={latestMetrics.diskWritePerSec || 100}
                  />
                  <MetricCard
                    title="Network Traffic"
                    value={latestMetrics.networkTraffic || 0}
                    unit="B/s"
                    max={latestMetrics.networkTraffic || 100}
                  />
                  <MetricCard
                    title="Running Processes"
                    value={latestMetrics.runningProcesses || 0}
                    unit=""
                    max={latestMetrics.totalProcesses || 100}
                  />
                  <MetricCard
                    title="Sleeping Processes"
                    value={latestMetrics.sleepingProcesses || 0}
                    unit=""
                    max={latestMetrics.totalProcesses || 100}
                  />
                  <MetricCard
                    title="Blocked Processes"
                    value={latestMetrics.blockedProcesses || 0}
                    unit=""
                    max={latestMetrics.totalProcesses || 100}
                  />
                  <MetricCard
                    title="Total Processes"
                    value={latestMetrics.totalProcesses || 0}
                    unit=""
                    max={latestMetrics.totalProcesses || 100}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Performance;
