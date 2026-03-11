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
    const interval = setInterval(fetchServers, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchServers = async () => {
    try {
      const response = await api.get("/api/servers");
      const serverData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      setServers(serverData);
    } catch (err) {
      setError("Failed to fetch servers" + err);
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
        servers.filter((s) => (s.id || s._id || s.serverId) !== serverId)
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to delete server. Please try again."
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
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
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                Server Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor and manage all your servers in one place
              </p>
            </div>
            <button
              onClick={() => navigate("/add-server")}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition font-medium"
            >
              + Add Server
            </button>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 px-6 py-4 rounded-lg mb-6 shadow-md">
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-5 rounded shadow">
              <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium uppercase mb-3">
                Total Servers
              </h3>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-5 rounded shadow">
              <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium uppercase mb-3">
                Active Servers
              </h3>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                {stats.active}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-5 rounded shadow">
              <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium uppercase mb-3">
                Blocked
              </h3>
              <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">
                {stats.blocked}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-5 rounded shadow">
              <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium uppercase mb-3">
                Inactive
              </h3>
              <p className="text-4xl font-bold text-red-600 dark:text-red-400">
                {stats.inactive}
              </p>
            </div>
          </div>

          {/* Servers List */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded shadow overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700">
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
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
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-medium"
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
                        className="hover:bg-gray-50 dark:hover:bg-slate-700 transition cursor-pointer"
                        onClick={() => {
                          const serverId =
                            server.id || server._id || server.serverId;
                          navigate(`/servers/${serverId}`);
                        }}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow">
                              {server.serverName?.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                              {server.serverName}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-mono text-sm bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded text-gray-700 dark:text-gray-300">
                            {server.ipAddress}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wide ${
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
                                navigate(`/servers/${serverId}`);
                              }}
                              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm font-medium"
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
                              className="bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 px-3 py-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition text-sm font-medium"
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
