import { useState } from "react";
import api from "../services/api";

const useDeleteServer = (setServers) => {
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    serverId: null,
    serverName: "",
  });

  const openDeleteDialog = (server) => {
    setDeleteDialog({
      isOpen: true,
      serverId: server.id,
      serverName: server.serverName,
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, serverId: null, serverName: "" });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/servers/${deleteDialog.serverId}`);

      setServers((prev) =>
        prev.filter((s) => s.id !== deleteDialog.serverId)
      );

      closeDeleteDialog();
    } catch (err) {
      alert("Failed to delete server");
    }
  };

  return {
    deleteDialog,
    openDeleteDialog,
    closeDeleteDialog,
    confirmDelete,
  };
};

export default useDeleteServer;