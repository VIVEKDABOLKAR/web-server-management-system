import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import MetricCard from "../components/MetricCard";
import AlertList from "../components/AlertList";
import BlockedIpList from "../components/BlockedIpList";

const ServerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [server, setServer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchServerDetails();
  }, [id]);

  const fetchServerDetails = async () => {
    try {
      console.log("Fetching server details for ID:", id);
      const response = await api.get(`/api/servers/${id}`);
      console.log("Server details response:", response);
      console.log("Server details data:", response.data);
      setServer(response.data);
    } catch (err) {
      setError("Failed to fetch server details");
      console.error("Error fetching server details:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-500 text-xl">
            Loading server details...
          </div>
        </div>
      </>
    );
  }

  if (error || !server) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error || "Server not found"}
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            {server.serverName}
          </h1>

          {/* Server Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Server Information */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                Server Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">IP Address:</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {server.ipAddress}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      server.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {server.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">OS Type:</span>
                  <span className="text-gray-800">{server.osType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Web Server:</span>
                  <span className="text-gray-800">{server.webServerType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Created At:</span>
                  <span className="text-gray-800">
                    {new Date(server.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {server.description && (
                  <div className="pt-2 border-t">
                    <span className="text-gray-600 font-medium block mb-1">
                      Description:
                    </span>
                    <span className="text-gray-800">{server.description}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Agent Status */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                Agent Status
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">
                    Agent Installed:
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      server.agentInstalled
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {server.agentInstalled ? "✓ Installed" : "Not Installed"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">
                    Last Heartbeat:
                  </span>
                  <span className="text-gray-800">
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Latest Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="CPU Usage"
                value={server.latestMetrics?.cpuUsage || 0}
                unit="%"
                max={100}
              />
              <MetricCard
                title="Memory Usage"
                value={server.latestMetrics?.memoryUsage || 0}
                unit="%"
                max={100}
              />
              <MetricCard
                title="Request Count"
                value={server.latestMetrics?.requestCount || 0}
                unit=""
                max={server.latestMetrics?.requestCount || 100}
              />
            </div>
          </div>

          {/* Alerts and Blocked IPs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AlertList serverId={id} />
            <BlockedIpList serverId={id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ServerDetails;
