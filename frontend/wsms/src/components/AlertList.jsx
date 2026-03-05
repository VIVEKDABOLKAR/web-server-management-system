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
      setAlerts(response.data);
    } catch (err) {
      setError("Failed to fetch alerts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Alerts</h2>
        <p className="text-gray-500">Loading alerts...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
        Alerts
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {alerts.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No alerts found</p>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-gray-800">
                  {alert.alertType}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    alert.status === "active"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {alert.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{alert.message}</p>
              <p className="text-xs text-gray-400">
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
