import { useState, useEffect } from "react";
import api from "../../services/api";
import MetricCard from "../../components/MetricCard";
import GaugeMetricCard from "../../components/server/GaugeMetricCard";
import {
  FiActivity,
  FiClock,
  FiCpu,
  FiHardDrive,
  FiLayers,
  FiServer,
  FiWifi,
} from "react-icons/fi";

const bytesToMbps = (bytesPerSec = 0) => {
  const safe = Number.isFinite(bytesPerSec) ? bytesPerSec : 0;
  return (safe * 8) / (1024 * 1024);
};

const formatTime = (timestamp) => {
  if (!timestamp) return "-";
  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString();
};

const HeaderChip = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 rounded-xl border border-slate-300/80 bg-white/85 px-3 py-2 text-sm text-slate-700 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200">
    <span className="text-cyan-700 dark:text-cyan-300">{icon}</span>
    <span className="text-slate-500 dark:text-slate-400">{label}:</span>
    <span className="font-semibold text-slate-900 dark:text-slate-100">{value}</span>
  </div>
);

const SectionTitle = ({ icon, title, subtitle }) => (
  <div className="mb-4 flex items-center justify-between gap-4 border-b border-slate-200 pb-2 dark:border-slate-700">
    <div className="flex items-center gap-3">
      <span className="rounded-lg bg-cyan-100 p-2 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300">
        {icon}
      </span>
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
        {subtitle ? (
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  </div>
);

const Performance = () => {
  const [servers, setServers] = useState([]);
  const [serverMetrics, setServerMetrics] = useState({}); // { serverId: [metrics] }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [metricsTimeRange, setMetricsTimeRange] = useState(24); // hours
  const [chartView, setChartView] = useState("individual");

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
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50 to-blue-100 px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-slate-300 bg-white/80 p-10 text-center shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300">
              <FiActivity className="text-2xl" />
            </div>
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              Loading performance metrics...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50 to-blue-100 px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-300 bg-red-50/90 p-8 text-center text-red-700 shadow-lg dark:border-red-700 dark:bg-red-900/20 dark:text-red-300">
            <p className="text-xl font-semibold">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (servers.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50 to-blue-100 px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950">
        <div className="mx-auto flex h-full max-w-7xl flex-col items-center justify-center py-10">
          <h1 className="mb-8 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Performance Metrics
          </h1>
          <div className="rounded-2xl border border-slate-300 bg-white/85 p-10 text-center text-slate-500 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/75 dark:text-slate-300">
            <div className="mb-3 text-6xl">📊</div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50 to-blue-100 px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-slate-300 bg-white/75 p-6 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                Performance Command Center
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Live infrastructure snapshot across your monitored servers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <label htmlFor="metrics-hours" className="mr-2 text-slate-500 dark:text-slate-400">
                  Window
                </label>
                <select
                  id="metrics-hours"
                  value={metricsTimeRange}
                  onChange={(e) => setMetricsTimeRange(Number(e.target.value))}
                  className="bg-transparent font-semibold outline-none"
                >
                  <option value={6}>Last 6h</option>
                  <option value={12}>Last 12h</option>
                  <option value={24}>Last 24h</option>
                  <option value={48}>Last 48h</option>
                </select>
              </div>

              <div className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <label htmlFor="view-style" className="mr-2 text-slate-500 dark:text-slate-400">
                  Layout
                </label>
                <select
                  id="view-style"
                  value={chartView}
                  onChange={(e) => setChartView(e.target.value)}
                  className="bg-transparent font-semibold outline-none"
                >
                  <option value="individual">Detailed</option>
                  <option value="compact">Compact</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {servers.map((server) => {
          const metrics = serverMetrics[server.id] || [];
          const latestMetrics = metrics.length > 0 ? metrics[0] : null;
          const bandwidthMbps = bytesToMbps(latestMetrics?.networkTraffic || 0);

          return (
            <section
              key={server.id}
              className="mb-8 rounded-3xl border border-slate-300 bg-white/85 p-5 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/75"
            >
              <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                    {server.serverName}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{server.ipAddress}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <HeaderChip icon={<FiServer />} label="Server" value={`#${server.id}`} />
                  <HeaderChip
                    icon={<FiClock />}
                    label="Last Update"
                    value={formatTime(latestMetrics?.timestamp)}
                  />
                  <HeaderChip
                    icon={<FiWifi />}
                    label="Network Bandwidth"
                    value={`${bandwidthMbps.toFixed(2)} Mb/s`}
                  />
                </div>
              </div>

              {metrics.length === 0 ? (
                <div className="mb-2 rounded-2xl border border-slate-300 bg-slate-50 p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                  <div className="mb-2 text-5xl">📉</div>
                  <p>
                    No metrics available yet for this server.
                    <br />
                    Make sure the agent is running and configured properly.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <GaugeMetricCard
                      title="CPU Utilization"
                      value={latestMetrics.cpuUsage || 0}
                      unit="%"
                      maxValue={100}
                    />
                    <GaugeMetricCard
                      title="Memory Utilization"
                      value={latestMetrics.memoryUsage || 0}
                      unit="%"
                      maxValue={100}
                    />
                    <GaugeMetricCard
                      title="Network Bandwidth"
                      value={bandwidthMbps}
                      unit=" Mb/s"
                      maxValue={100}
                    />
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                    <SectionTitle
                      icon={<FiCpu />}
                      title="System Core Metrics"
                      subtitle="Compute and storage health"
                    />
                    <div
                      className={`grid grid-cols-1 gap-4 ${chartView === "compact" ? "md:grid-cols-3" : "md:grid-cols-4"}`}
                    >
                      <MetricCard
                        title="CPU Usage"
                        value={latestMetrics.cpuUsage || 0}
                        unit="%"
                        max={100}
                      />
                      <MetricCard
                        title="Load Average (1m)"
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
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                    <SectionTitle
                      icon={<FiHardDrive />}
                      title="Disk and Network Throughput"
                      subtitle="I/O and data flow"
                    />
                    <div
                      className={`grid grid-cols-1 gap-4 ${chartView === "compact" ? "md:grid-cols-3" : "md:grid-cols-4"}`}
                    >
                      <MetricCard
                        title="Disk Reads"
                        value={latestMetrics.diskReadPerSec || 0}
                        unit="B/s"
                        max={latestMetrics.diskReadPerSec || 100}
                      />
                      <MetricCard
                        title="Disk Writes"
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
                        title="Network Bandwidth"
                        value={bandwidthMbps}
                        unit=" Mb/s"
                        max={100}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                    <SectionTitle
                      icon={<FiLayers />}
                      title="Process Activity"
                      subtitle="Runtime process distribution"
                    />
                    <div
                      className={`grid grid-cols-1 gap-4 ${chartView === "compact" ? "md:grid-cols-3" : "md:grid-cols-4"}`}
                    >
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
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
export default Performance;
