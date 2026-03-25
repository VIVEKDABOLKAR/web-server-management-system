import { useState, useEffect } from "react";
import api from "../services/api";

const statusPillMap = {
  OPEN: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  ACKNOWLEDGED: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  CLOSED: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
};

const AlertList = ({ serverId }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingAlertId, setUpdatingAlertId] = useState(null);

  useEffect(() => {
    fetchAlerts();
  }, [serverId]);

  const fetchAlerts = async () => {
    try {
      const response = await api.get(`/api/alerts/server/${serverId}`);
      const rows = Array.isArray(response.data) ? response.data : [];
      setAlerts(
        [...rows].sort(
          (a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime(),
        ),
      );
      setError("");
    } catch (err) {
      setError("Failed to fetch alerts");
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg dark:shadow-slate-900/30">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Alerts
        </h2>
        <p className="text-gray-500 dark:text-gray-400">Loading alerts...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg dark:shadow-gray-900/30">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        Alerts
      </h2>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {alerts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          No alerts found
        </p>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-lg p-4 transition ${String(alert?.alertType || "").toUpperCase() === "SERVER_DOWN" ? "border-red-300 dark:border-red-700 bg-red-50/70 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30" : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {String(alert.alertType || "UNKNOWN").replaceAll("_", " ")}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    statusPillMap[String(alert.status || "").toUpperCase()] ||
                    "bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {String(alert.status || "unknown").toUpperCase()}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                {alert.message || "No message"}
                {Number.isFinite(Number(alert?.value)) && Number.isFinite(Number(alert?.threshold))
                  ? ` (${Number(alert.value).toFixed(2)}/${Number(alert.threshold).toFixed(2)})`
                  : ""}
              </p>
              <div className="flex flex-wrap justify-between items-center gap-2">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {new Date(alert.createdAt).toLocaleString()}
                </p>

                <div className="flex gap-2">
                  {String(alert.status || "").toUpperCase() !== "OPEN" && (
                    <button
                      type="button"
                      onClick={() => updateAlertStatus(alert.id, "OPEN")}
                      disabled={updatingAlertId === alert.id}
                      className="px-2.5 py-1 rounded text-xs border border-red-400 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                    >
                      Reopen
                    </button>
                  )}
                  {String(alert.status || "").toUpperCase() === "OPEN" && (
                    <button
                      type="button"
                      onClick={() => updateAlertStatus(alert.id, "ACKNOWLEDGED")}
                      disabled={updatingAlertId === alert.id}
                      className="px-2.5 py-1 rounded text-xs border border-amber-400 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 disabled:opacity-50"
                    >
                      Acknowledge
                    </button>
                  )}
                  {String(alert.status || "").toUpperCase() !== "CLOSED" && (
                    <button
                      type="button"
                      onClick={() => updateAlertStatus(alert.id, "CLOSED")}
                      disabled={updatingAlertId === alert.id}
                      className="px-2.5 py-1 rounded text-xs border border-green-400 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 disabled:opacity-50"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertList;
