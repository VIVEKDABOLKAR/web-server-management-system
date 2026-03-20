import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import ServerTable from "../../../components/server/ServerTable";
import ConfirmDialog from "../../../components/ConfirmDialog";

import useServers from "../../../hooks/useServers";

const AllServers = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const statusFilter = params.get("status");

  const { servers, loading, deleteServer } = useServers();

  const [searchTerm, setSearchTerm] = useState("");

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    serverId: null,
    serverName: "",
  });

  // 🔍 Search handler
  const handleSearchChange = (term) => setSearchTerm(term);

  // 👁 View
  const handleView = (id) => {
    navigate(`/servers/${id}`);
  };

  // ➕ Add
  const handleAdd = () => {
    navigate("/add-server");
  };

  // ❌ Open delete dialog
  const handleDelete = (id, name) => {
    setDeleteDialog({
      isOpen: true,
      serverId: id,
      serverName: name,
    });
  };

  // ✅ Confirm delete
  const confirmDelete = async () => {
    try {
      await deleteServer(deleteDialog.serverId);

      setDeleteDialog({
        isOpen: false,
        serverId: null,
        serverName: "",
      });
    } catch (err) {
      alert("Failed to delete server");
    }
  };

  // 🔍 Filter logic
  const filteredServers = servers.filter((server) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      server.serverName?.toLowerCase().includes(term) ||
      server.ipAddress?.toLowerCase().includes(term) ||
      server.osType?.name?.toLowerCase().includes(term) ||
      server.webServerType?.name?.toLowerCase().includes(term) ||
      String(server.webServerPortNo)?.toLowerCase().includes(term);

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
        {/* Header */}
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
            {/* Table */}
            <ServerTable
              servers={filteredServers}
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              onView={handleView}
              onDelete={handleDelete}
              onAdd={handleAdd}
            />

            {/* Confirm Dialog */}
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
