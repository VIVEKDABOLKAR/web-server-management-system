import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import ConfirmDialog from "../components/ConfirmDialog";

const Dashboard = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    serverId: null,
    serverName: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchServers();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchServers, 30000);
    return () => clearInterval(interval);
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
    const active = servers.filter(
      (s) => s.status?.toLowerCase() === "active",
    ).length;
    const inactive = servers.filter(
      (s) => s.status?.toLowerCase() === "inactive",
    ).length;
    const blocked = servers.filter(
      (s) => s.status?.toLowerCase() === "blocked",
    ).length;

    return { total, active, inactive, blocked };
  };

  const handleDeleteServer = (serverId, serverName, e) => {
    e.stopPropagation();
    setDeleteDialog({ isOpen: true, serverId, serverName });
  };

  const confirmDelete = async () => {
    const { serverId } = deleteDialog;

    try {
      await api.delete(`/api/servers/${serverId}`);
      setServers(
        servers.filter((s) => (s.id || s._id || s.serverId) !== serverId),
      );
      console.log(`Server ${serverId} deleted successfully`);
    } catch (err) {
      console.error("Error deleting server:", err);
      alert(
        err.response?.data?.message ||
          "Failed to delete server. Please try again.",
      );
    }
  };

  const filteredServers = servers.filter(
    (server) =>
      server.serverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.ipAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.osType?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const stats = getStats();

  console.log("Servers state:", servers);
  console.log("Stats:", stats);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 dark:border-blue-400 mb-4"></div>
            <div className="text-gray-600 dark:text-gray-300 text-xl font-medium">
              Loading your servers...
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar hideDashboard={true} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Server Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor and manage all your servers in one place
              </p>
            </div>
            <button
              onClick={() => navigate("/add-server")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Add Server
            </button>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 px-6 py-4 rounded-lg mb-6 shadow-md">
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm border-2 border-blue-200 dark:border-blue-500/30 p-6 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <h3 className="text-blue-600 dark:text-blue-300 text-sm font-semibold uppercase tracking-wide mb-4">
                Total Servers
              </h3>
              <p className="text-5xl font-bold text-blue-700 dark:text-blue-200">
                {stats.total}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm border-2 border-green-200 dark:border-green-500/30 p-6 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <h3 className="text-green-600 dark:text-green-300 text-sm font-semibold uppercase tracking-wide mb-4">
                Active Servers
              </h3>
              <p className="text-5xl font-bold text-green-700 dark:text-green-200">
                {stats.active}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm border-2 border-amber-200 dark:border-amber-500/30 p-6 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <h3 className="text-amber-600 dark:text-amber-300 text-sm font-semibold uppercase tracking-wide mb-4">
                Blocked
              </h3>
              <p className="text-5xl font-bold text-amber-700 dark:text-amber-200">
                {stats.blocked}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm border-2 border-red-200 dark:border-red-500/30 p-6 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <h3 className="text-red-600 dark:text-red-300 text-sm font-semibold uppercase tracking-wide mb-4">
                Inactive
              </h3>
              <p className="text-5xl font-bold text-red-700 dark:text-red-200">
                {stats.inactive}
              </p>
            </div>
          </div>

          {/* Servers List */}
          <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-2xl shadow-lg overflow-hidden transition-colors">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-gray-50 to-white dark:from-slate-800/50 dark:to-slate-800/50">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  All Servers
                </h2>
                <div className="w-full md:w-96">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search servers by name, IP, or OS..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {servers.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">
                  No servers found. Add a server to get started.
                </p>
                <button
                  onClick={() => navigate("/add-server")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition font-semibold shadow-lg"
                >
                  + Add Your First Server
                </button>
              </div>
            ) : filteredServers.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No servers match your search criteria.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-slate-700">
                      <th className="text-left py-4 px-6 text-gray-700 dark:text-gray-300 font-bold uppercase text-xs tracking-wider">
                        Server Name
                      </th>
                      <th className="text-left py-4 px-6 text-gray-700 dark:text-gray-300 font-bold uppercase text-xs tracking-wider">
                        IP Address
                      </th>
                      <th className="text-left py-4 px-6 text-gray-700 dark:text-gray-300 font-bold uppercase text-xs tracking-wider">
                        Status
                      </th>
                      <th className="text-left py-4 px-6 text-gray-700 dark:text-gray-300 font-bold uppercase text-xs tracking-wider">
                        OS Type
                      </th>
                      <th className="text-left py-4 px-6 text-gray-700 dark:text-gray-300 font-bold uppercase text-xs tracking-wider">
                        Web Server
                      </th>
                      <th className="text-left py-4 px-6 text-gray-700 dark:text-gray-300 font-bold uppercase text-xs tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredServers.map((server) => (
                      <tr
                        key={server.id || server._id || server.serverId}
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition cursor-pointer"
                        onClick={() => {
                          const serverId =
                            server.id || server._id || server.serverId;
                          navigate(`/servers/${serverId}`);
                        }}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                              {server.serverName?.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                              {server.serverName}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-mono text-sm bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-lg text-gray-700 dark:text-gray-300">
                            {server.ipAddress}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${
                              server.status?.toLowerCase() === "active"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700"
                                : server.status?.toLowerCase() === "blocked"
                                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700"
                                  : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700"
                            }`}
                          >
                            {server.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-700 dark:text-gray-300 font-medium">
                          {server.osType}
                        </td>
                        <td className="py-4 px-6 text-gray-700 dark:text-gray-300 font-medium">
                          {server.webServerType}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
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
                              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 hover:-translate-y-0.5 transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-xl flex items-center gap-1"
                            >
                              View Details
                            </button>
                            <button
                              onClick={(e) =>
                                handleDeleteServer(
                                  server.id || server._id || server.serverId,
                                  server.serverName,
                                  e,
                                )
                              }
                              className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-2 border-red-300 dark:border-red-700 px-3 py-2 rounded-lg hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white hover:-translate-y-0.5 transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-xl"
                              title="Delete Server"
                            >
                              Delete
                            </button>
                          </div>
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

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() =>
          setDeleteDialog({ isOpen: false, serverId: null, serverName: "" })
        }
        onConfirm={confirmDelete}
        title="Delete Server"
        message="Are you sure you want to delete this server?"
        serverName={deleteDialog.serverName}
      />
    </>
  );
};

export default Dashboard;
