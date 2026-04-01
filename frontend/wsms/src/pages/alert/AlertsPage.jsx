import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";

const PAGE_BG = "min-h-full p-4 md:p-6 bg-gradient-to-br from-slate-100 via-cyan-50 to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950";
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

const getSeverity = (alertType, hasMetrics, diff) => {
  if (String(alertType || "").toUpperCase() === "SERVER_DOWN") return "critical";
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

const statusPillMap = {
  OPEN: "bg-red-200 border border-red-400 text-red-800 dark:bg-red-900/30 dark:border-red-700/60 dark:text-red-300",
  ACKNOWLEDGED:
    "bg-amber-200 border border-amber-400 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700/60 dark:text-amber-300",
  CLOSED:
    "bg-emerald-200 border border-emerald-400 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-700/60 dark:text-emerald-300",
};

const getStatusClass = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "open") return statusPillMap.OPEN;
  if (normalized === "acknowledged") return statusPillMap.ACKNOWLEDGED;
  if (normalized === "closed") return statusPillMap.CLOSED;
  return "bg-slate-200 border border-slate-400 text-slate-700 dark:bg-slate-700/50 dark:border-slate-500 dark:text-slate-200";
};

const normalizeTypeLabel = (alertType) => {
  return String(alertType || "UNKNOWN").replaceAll("_", " ");
};

const formatTime = (value) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString();
};

const sortAlertsByNewest = (rows) => {
  return [...rows].sort((a, b) => {
    const aTime = new Date(a?.createdAt || 0).getTime();
    const bTime = new Date(b?.createdAt || 0).getTime();
    return bTime - aTime;
  });
};

const AlertsPage = ({ serverId }) => {
  const location = useLocation();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [updatingAlertId, setUpdatingAlertId] = useState(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState("ALL");
  const [activeTypeFilter, setActiveTypeFilter] = useState("ALL");

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const highlightedAlertId = searchParams.get("alertId");
  const queryServerId = searchParams.get("serverId");

  const resolvedServerId =
    serverId && typeof serverId === "object"
      ? (serverId.id ?? queryServerId ?? "")
      : (serverId ?? queryServerId ?? "");

  const fetchAlerts = async ({ showLoader = false, showRefreshing = false, signal } = {}) => {
    if (showLoader) setLoading(true);
    if (showRefreshing) setRefreshing(true);

    try {
      const endpoint = resolvedServerId ? `/api/alerts/server/${resolvedServerId}` : "/api/alerts";
      const response = await api.get(endpoint, { signal });
      const rows = Array.isArray(response.data) ? response.data : [];
      setAlerts(sortAlertsByNewest(rows));
      setError("");
    } catch (err) {
      if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") return;

      setError(err?.response?.data?.message || "Failed to fetch alerts");
      setAlerts([]);
    } finally {
      if (showLoader) setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  const updateAlertStatus = async (alertId, nextStatus) => {
    const statusEndpointMap = {
      OPEN: "open",
      ACKNOWLEDGED: "acknowledged",
      CLOSED: "closed",
    };
    const endpointValue = statusEndpointMap[nextStatus];
    if (!endpointValue) return;

    try {
      setUpdatingAlertId(alertId);
      await api.put(`/api/alerts/${alertId}/${endpointValue}`);
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, status: nextStatus } : alert,
        ),
      );
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update alert status");
    } finally {
      setUpdatingAlertId(null);
    }
  };

  const handleAlertRowClick = async (alert) => {
    const status = String(alert?.status || "").toUpperCase();
    if (status !== "OPEN") return;
    await updateAlertStatus(alert.id, "ACKNOWLEDGED");
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchAlerts({ showLoader: true, signal: controller.signal });

    const interval = setInterval(() => {
      fetchAlerts({ signal: controller.signal });
    }, 20000);

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [resolvedServerId]);

  const statusCount = { OPEN: 0, ACKNOWLEDGED: 0, CLOSED: 0 };
  const typeSet = new Set();
  for (const alert of alerts) {
    const status = String(alert?.status || "").toUpperCase();
    if (statusCount[status] !== undefined) statusCount[status] += 1;

    const type = String(alert?.alertType || "UNKNOWN").toUpperCase();
    typeSet.add(type);
  }

  let visibleAlerts = alerts;
  if (activeStatusFilter !== "ALL") {
    visibleAlerts = visibleAlerts.filter(
      (alert) => String(alert?.status || "").toUpperCase() === activeStatusFilter,
    );
  }
  if (activeTypeFilter !== "ALL") {
    visibleAlerts = visibleAlerts.filter(
      (alert) => String(alert?.alertType || "").toUpperCase() === activeTypeFilter,
    );
  }

  useEffect(() => {
    if (!highlightedAlertId || visibleAlerts.length === 0) return;

    const timeoutId = setTimeout(() => {
      const target = document.getElementById(`alert-row-${highlightedAlertId}`);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 80);

    return () => clearTimeout(timeoutId);
  }, [highlightedAlertId, visibleAlerts]);

  const typeOptions = ["ALL", ...Array.from(typeSet)];

  const statusOptions = ["ALL", "OPEN", "ACKNOWLEDGED", "CLOSED"];

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
        <div className="px-5 md:px-6 py-5 bg-linear-to-r from-slate-800 via-cyan-700 to-blue-800 dark:from-slate-900 dark:via-slate-800 dark:to-cyan-900 text-white">
          <h2 className="text-2xl font-bold tracking-tight">Alert Stream</h2>
          <p className="text-sm text-cyan-100 dark:text-slate-200 mt-1">
            Monitor CPU, memory, disk and server-down incidents in one place.
          </p>
        </div>

        <div className="p-4 md:p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="rounded-xl border border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-slate-800">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Total</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{alerts.length}</p>
            </div>
            <div className="rounded-xl border border-red-300 dark:border-red-700 p-3 bg-red-50 dark:bg-red-900/20">
              <p className="text-xs uppercase tracking-wide text-red-700 dark:text-red-300">Open</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">{statusCount.OPEN}</p>
            </div>
            <div className="rounded-xl border border-amber-300 dark:border-amber-700 p-3 bg-amber-50 dark:bg-amber-900/20">
              <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-300">Acknowledged</p>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{statusCount.ACKNOWLEDGED}</p>
            </div>
            <div className="rounded-xl border border-emerald-300 dark:border-emerald-700 p-3 bg-emerald-50 dark:bg-emerald-900/20">
              <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Closed</p>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{statusCount.CLOSED}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
            <select
              value={activeStatusFilter}
              onChange={(e) => setActiveStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3 py-2 text-sm"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  Status: {status}
                </option>
              ))}
            </select>

            <select
              value={activeTypeFilter}
              onChange={(e) => setActiveTypeFilter(e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3 py-2 text-sm"
            >
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  Type: {normalizeTypeLabel(type)}
                </option>
              ))}
            </select>

            <button
              onClick={() => fetchAlerts({ showRefreshing: true })}
              disabled={refreshing}
              className="rounded-lg border border-cyan-400 text-cyan-700 dark:text-cyan-300 px-3 py-2 text-sm font-medium hover:bg-cyan-50 dark:hover:bg-slate-800 disabled:opacity-60"
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/25 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {visibleAlerts.length === 0 ? (
            <p className="text-center py-8 text-slate-500 dark:text-slate-400">
              No alerts found
            </p>
          ) : (
            <div className="space-y-3">
              <div className="hidden md:grid grid-cols-12 gap-x-20 px-3 md:px-4 py-2 text-xs uppercase tracking-[0.08em] font-semibold text-cyan-950 dark:text-slate-300 border border-cyan-300 dark:border-slate-700 rounded-xl bg-cyan-100 dark:bg-slate-800/60">
                <div className="md:col-span-2">Time</div>
                <div className="md:col-span-2">Server Name</div>
                <div className="md:col-span-2">Alert Type</div>
                <div className="md:col-span-1">State</div>
                <div className="md:col-span-1">Severity</div>
                <div className="md:col-span-2">Message</div>
                <div className="md:col-span-2 text-right">Actions</div>
              </div>

              {visibleAlerts.map((alert) => {
                const { hasMetrics, value, threshold, diff } = getMetricData(alert);
                const messageText = getMessageText(alert);
                const severity = getSeverity(alert.alertType, hasMetrics, diff);
                const severityClass = severityClassMap[severity];
                const statusClass = getStatusClass(alert.status);
                const alertTypeValue = String(alert?.alertType || "").toUpperCase();
                const alertStatusValue = String(alert?.status || "").toUpperCase();
                const isServerDown = alertTypeValue === "SERVER_DOWN";
                const isUpdating = updatingAlertId === alert.id;
                const isHighlighted =
                  highlightedAlertId && String(alert.id) === String(highlightedAlertId);
                const cardClass = isServerDown
                  ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20"
                  : "border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/40 hover:bg-cyan-100 dark:hover:bg-slate-800";

                return (
                  <div
                    key={alert.id}
                    id={`alert-row-${alert.id}`}
                    onClick={() => handleAlertRowClick(alert)}
                    className={`grid grid-cols-12 gap-x-6 gap-y-2 items-center px-3 md:px-4 py-3 rounded-xl border transition-colors ${cardClass} ${isHighlighted ? "ring-2 ring-cyan-500 dark:ring-cyan-400" : ""}`}
                    title={alert.message}
                  >
                    <div className="col-span-12 md:col-span-2 text-[11px] tracking-wide text-slate-600 dark:text-slate-400 truncate">
                      {formatTime(alert.createdAt)}
                    </div>
                    <div className="col-span-6 md:col-span-2 text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {alert.serverName || "Unknown Server"}
                    </div>
                    <div className="col-span-6 md:col-span-2 text-sm text-cyan-900 dark:text-cyan-300 font-semibold truncate">
                      {normalizeTypeLabel(alert.alertType)}
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
                    <div className="col-span-12 md:col-span-2 text-sm leading-5 text-slate-700 dark:text-slate-200 truncate">
                      <span className="inline-block max-w-full truncate px-2 py-0.5 rounded-md border border-cyan-500 text-cyan-950 dark:border-slate-600 dark:text-slate-100 bg-cyan-300 dark:bg-slate-700/70 font-medium shadow-sm align-middle">
                        {messageText}
                      </span>
                      {isServerDown ? (
                        <span className="ml-2 inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-red-200 text-red-800 dark:bg-red-900/40 dark:text-red-300">
                          needs attention
                        </span>
                      ) : null}
                      {hasMetrics ? (
                        <span className="text-slate-600 dark:text-slate-400"> | {value.toFixed(2)}/{threshold.toFixed(2)} ({diff > 0 ? "+" : ""}{diff.toFixed(2)})</span>
                      ) : null}
                    </div>

                    <div className="col-span-12 md:col-span-2 flex justify-start md:justify-end gap-2">
                      {alertStatusValue !== "OPEN" && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateAlertStatus(alert.id, "OPEN");
                          }}
                          disabled={isUpdating}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold border border-red-400 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                        >
                          Reopen
                        </button>
                      )}
                      {alertStatusValue !== "CLOSED" && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateAlertStatus(alert.id, "CLOSED");
                          }}
                          disabled={isUpdating}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold border border-emerald-400 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 disabled:opacity-50"
                        >
                          Close
                        </button>
                      )}
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


export default AlertsPage;