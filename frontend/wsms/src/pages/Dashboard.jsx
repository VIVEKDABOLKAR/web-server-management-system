import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      console.log("Fetching servers from /api/servers...");
      const response = await api.get("/api/servers");
      console.log("API Response:", response);
      console.log("Response data:", response.data);
      console.log("Number of servers:", response.data?.length);

      // Handle both array response and object with data property
      const serverData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      console.log("Processed server data:", serverData);
      setServers(serverData);
    } catch (err) {
      setError("Failed to fetch servers");
      console.error("Error fetching servers:", err);
      console.error("Error response:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    const total = servers.length;
    const active = servers.filter((s) => s.status === "active").length;
    const inactive = servers.filter((s) => s.status === "inactive").length;

    return { total, active, inactive };
  };

  const stats = getStats();

  console.log("Servers state:", servers);
  console.log("Stats:", stats);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-500 text-xl">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Server Dashboard
            </h1>
            <button
              onClick={() => navigate("/add-server")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              + Add Server
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">
                Total Servers
              </h3>
              <p className="text-4xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">
                Active Servers
              </h3>
              <p className="text-4xl font-bold text-green-600">
                {stats.active}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">
                Inactive Servers
              </h3>
              <p className="text-4xl font-bold text-red-600">
                {stats.inactive}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              All Servers
            </h2>

            {servers.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No servers found. Add a server to get started.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                        Server Name
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                        IP Address
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                        OS Type
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                        Web Server Type
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {servers.map((server) => (
                      <tr
                        key={server.id || server._id || server.serverId}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 font-medium">
                          {server.serverName}
                        </td>
                        <td className="py-3 px-4 font-mono text-sm text-gray-600">
                          {server.ipAddress}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              server.status?.toLowerCase() === "active"
                                ? "bg-green-100 text-green-700"
                                : server.status?.toLowerCase() === "blocked"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {server.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{server.osType}</td>
                        <td className="py-3 px-4">{server.webServerType}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => {
                              const serverId =
                                server.id || server._id || server.serverId;
                              console.log(
                                "Navigating to server:",
                                serverId,
                                "Full server:",
                                server,
                              );
                              navigate(`/servers/${serverId}`);
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
