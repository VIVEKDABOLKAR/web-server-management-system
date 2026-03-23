import { useState, useEffect, useMemo } from "react";
import api from "./services/api";

const PAGE_BG = "min-h-screen p-4 md:p-6 bg-gradient-to-br from-slate-300 via-cyan-200 to-blue-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950";
const PANEL_BG = "rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/95 dark:bg-slate-900 shadow-xl overflow-hidden";

const getMessageText = (alert) => {
  if (typeof alert?.message === "string" && alert.message.trim()) return alert.message.trim();
  return "No message";
};

const getMetricData = (alert) => {
  const value = Number(alert?.value);
  const threshold = Number(alert?.threshold);
  const hasMetrics = Number.isFinite(value) && Number.isFinite(threshold);
  const diff = hasMetrics ? value - threshold : 0;
  return { hasMetrics, value, threshold, diff };
};

const getSeverity = (hasMetrics, diff) => {
  if (!hasMetrics) return "normal";
  if (diff > 20) return "critical";
  if (diff > 0) return "warning";
  return "normal";
};

const severityClassMap = {
  critical: "bg-rose-200 border border-rose-400 text-rose-800 dark:bg-rose-900/30 dark:border-rose-700/60 dark:text-rose-300",
  warning: "bg-amber-200 border border-amber-400 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700/60 dark:text-amber-300",
  normal: "bg-emerald-200 border border-emerald-400 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-700/60 dark:text-emerald-300",
};

const getStatusClass = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "active") {
    return "bg-red-200 border border-red-400 text-red-800 dark:bg-red-900/30 dark:border-red-700/60 dark:text-red-300";
  }
  return "bg-green-200 border border-green-400 text-green-800 dark:bg-green-900/30 dark:border-green-700/60 dark:text-green-300";
};

const AlertList = ({ serverId }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const resolvedServerId = useMemo(() => {
    if (serverId && typeof serverId === "object") return serverId.id ?? "";
    return serverId ?? "";
  }, [serverId]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAlerts = async () => {
      try {
        const endpoint = resolvedServerId ? `/api/alerts/server/${resolvedServerId}` : "/api/alerts";
        const response = await api.get(endpoint, { signal: controller.signal });
        setAlerts(Array.isArray(response.data) ? response.data : []);
        setError("");
      } catch (err) {
        if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") return;

        setError(err?.response?.data?.message || "Failed to fetch alerts");
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();

    return () => controller.abort();
  }, [resolvedServerId]);

  if (loading) {
    return (
      <div className={PAGE_BG}>
        <div className="mx-auto max-w-7xl rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/95 dark:bg-slate-900 p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Alerts</h2>
          <p className="text-slate-500 dark:text-slate-400">Loading alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={PAGE_BG}>
      <div className={`mx-auto max-w-7xl ${PANEL_BG}`}>
        <div className="px-5 md:px-6 py-5 bg-gradient-to-r from-slate-800 via-cyan-700 to-blue-800 dark:from-slate-900 dark:via-slate-800 dark:to-cyan-900 text-white">
          <h2 className="text-2xl font-bold tracking-tight">Alert Stream</h2>
          <p className="text-sm text-cyan-100 dark:text-slate-200 mt-1">Compact real-time incidents view</p>
        </div>

        <div className="p-4 md:p-5">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/25 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {alerts.length === 0 ? (
            <p className="text-center py-8 text-slate-500 dark:text-slate-400">
              No alerts found
            </p>
          ) : (
            <div className="space-y-3">
              <div className="hidden md:grid grid-cols-12 gap-x-20 px-3 md:px-4 py-2 text-xs uppercase tracking-[0.08em] font-semibold text-cyan-950 dark:text-slate-300 border border-cyan-300 dark:border-slate-700 rounded-xl bg-cyan-100 dark:bg-slate-800/60">
                <div className="md:col-span-2">Time</div>
                <div className="md:col-span-2">Server Name</div>
                <div className="md:col-span-2">Alert Type</div>
                <div className="md:col-span-1">Status</div>
                <div className="md:col-span-1">Severity</div>
                <div className="md:col-span-4">Message</div>
              </div>

              {alerts.map((alert) => {
                const { hasMetrics, value, threshold, diff } = getMetricData(alert);
                const messageText = getMessageText(alert);
                const severity = getSeverity(hasMetrics, diff);
                const severityClass = severityClassMap[severity];
                const statusClass = getStatusClass(alert.status);

                return (
                  <div
                    key={alert.id}
                    className="grid grid-cols-12 gap-x-20 gap-y-1 items-center px-3 md:px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/40 hover:bg-cyan-100 dark:hover:bg-slate-800 transition-colors"
                    title={alert.message}
                  >
                    <div className="col-span-12 md:col-span-2 text-[11px] tracking-wide text-slate-600 dark:text-slate-400 truncate">
                      {new Date(alert.createdAt).toLocaleString()}
                    </div>
                    <div className="col-span-6 md:col-span-2 text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {alert.serverName || "Unknown Server"}
                    </div>
                    <div className="col-span-6 md:col-span-2 text-sm text-cyan-900 dark:text-cyan-300 font-semibold truncate">
                      {alert.alertType}
                    </div>
                    <div className="col-span-6 md:col-span-1">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusClass}`}>
                        {String(alert.status || "unknown").toUpperCase()}
                      </span>
                    </div>
                    <div className="col-span-6 md:col-span-1">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase ${severityClass}`}>
                        {severity}
                      </span>
                    </div>
                    <div className="col-span-12 md:col-span-4 text-sm leading-5 text-slate-700 dark:text-slate-200 truncate">
                      <span className="inline-block max-w-full truncate px-2 py-0.5 rounded-md border border-cyan-500 text-cyan-950 dark:border-slate-600 dark:text-slate-100 bg-cyan-300 dark:bg-slate-700/70 font-medium shadow-sm align-middle">
                        {messageText}
                      </span>
                      {hasMetrics ? (
                        <span className="text-slate-600 dark:text-slate-400"> | {value.toFixed(2)}/{threshold.toFixed(2)} ({diff > 0 ? "+" : ""}{diff.toFixed(2)})</span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default AlertList;