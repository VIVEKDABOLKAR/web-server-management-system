import { useState, useEffect } from "react";
import api from "../services/api";

const AlertList = ({ serverId }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAlerts();
  }, [serverId]);

  const fetchAlerts = async () => {
    try {
      const response = await api.get(`/api/alerts/server/${serverId}`);
      console.log(response);
      
      setAlerts(response.data);
    } catch (err) {
      setError("Failed to fetch alerts");
    } finally {
      setLoading(false);
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
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {alert.alertType}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    alert.status === "active"
                      ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  }`}
                >
                  {alert.status}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                {alert.message +" "+ alert.value}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {new Date(alert.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertList;
