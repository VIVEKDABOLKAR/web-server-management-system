import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ServerTable from "../../../components/server/ServerTable";
import ConfirmDialog from "../../../components/ConfirmDialog";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import api from "../../../services/api";

const AllServers = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const statusFilter = params.get("status");

  const [servers, setServers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    serverId: null,
    serverName: "",
  });

  // ✅ Fetch servers
  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/servers");
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      setServers(data);
    } catch (err) {
      console.error("Failed to fetch servers", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handlers
  const handleSearchChange = (term) => setSearchTerm(term);

  const handleView = (id) => {
    navigate(`/servers/${id}`);
  };

  const handleAdd = () => {
    navigate("/add-server");
  };

  const handleDelete = (id, name) => {
    setDeleteDialog({
      isOpen: true,
      serverId: id,
      serverName: name,
    });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/servers/${deleteDialog.serverId}`);

      setServers((prev) =>
        prev.filter(
          (s) =>
            (s.id || s._id || s.serverId) !== deleteDialog.serverId
        )
      );

      setDeleteDialog({
        isOpen: false,
        serverId: null,
        serverName: "",
      });
    } catch (err) {
      alert("Failed to delete server. Please try again.");
    }
  };

  // ✅ Filtering (search + status)
  const filteredServers = servers.filter((server) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      server.serverName?.toLowerCase().includes(term) ||
      server.ipAddress?.toLowerCase().includes(term) ||
      server.osType?.toLowerCase().includes(term) ||
      server.webServerType?.toLowerCase().includes(term) ||
      server.webServerPortNo?.toLowerCase().includes(term);

    if (statusFilter === "active") {
      return matchesSearch && server.status?.toLowerCase() === "active";
    }

    if (statusFilter === "inactive") {
      return matchesSearch && server.status?.toLowerCase() === "inactive";
    }

    return matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="p-6 bg-slate-100 dark:bg-slate-950 min-h-screen">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            All Servers
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            View, search, and manage all your servers in one place.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Server Table */}
            <ServerTable
              servers={filteredServers}
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              onView={handleView}
              onDelete={handleDelete}
              onAdd={handleAdd}
            />

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
              isOpen={deleteDialog.isOpen}
              onClose={() =>
                setDeleteDialog({
                  isOpen: false,
                  serverId: null,
                  serverName: "",
                })
              }
              onConfirm={confirmDelete}
              title="Delete Server"
              message={`Are you sure you want to delete ${
                deleteDialog.serverName || "this server"
              }?`}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AllServers;