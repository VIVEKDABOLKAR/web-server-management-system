import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Table from "../../components/Table";
import SectionCard from "../../components/SectionCard";
import useAdminDashboard from "../../hooks/useAdminDashboard";
import api from "../../services/api";
import { toast } from "react-toastify";

// ✅ Centralized normalization
const normalizeUser = (u) => ({
  ...u,
  isActive: u.status === "ACTIVE",
  fullName: u.fullName || u.username || "-",
  statusText: u.status === "ACTIVE" ? "Active" : "Blocked",
});

const UserManagement = () => {
  const navigate = useNavigate();
  const { users, loading, error } = useAdminDashboard();

  const [userList, setUserList] = useState([]);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  // ✅ Normalize users once
  useEffect(() => {
    setUserList(users.map(normalizeUser));
  }, [users]);

  // ✅ Load current user
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const response = await api.get("/api/users/profile");
        setCurrentUserId(response?.data?.id ?? null);
      } catch (err) {
        console.error("Failed to load current user profile", err);
      }
    };

    loadCurrentUser();
  }, []);

  const handleAddUser = () => {
    navigate(`/admin/add-user`);
  };

  // ✅ Toggle Active
  const handleToggleActive = async (userId) => {
    try {
      setUpdatingUserId(userId);

      const user = userList.find((u) => u.id === userId);
      const newStatus = !user?.isActive;

      await api.put(`/api/admin/users/${userId}/status`, {
        active: newStatus,
      });

      setUserList((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                isActive: newStatus,
                statusText: newStatus ? "Active" : "Blocked",
              }
            : u,
        ),
      );

      toast.success(
        `User ${newStatus ? "activated" : "blocked"} successfully`,
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user status");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // ✅ Delete User (with confirmation)
  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );
    if (!confirmDelete) return;

    try {
      setUpdatingUserId(userId);

      await api.delete(`/api/admin/users/${userId}`);

      setUserList((prev) => prev.filter((u) => u.id !== userId));

      toast.success("User deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // ✅ Toggle Role
  const handleToggleRole = async (userId) => {
    try {
      setUpdatingUserId(userId);

      const user = userList.find((u) => u.id === userId);
      const newRole = user?.role === "ADMIN" ? "USER" : "ADMIN";

      await api.put(`/api/admin/users/${userId}/role`, {
        role: newRole,
      });

      setUserList((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, role: newRole } : u,
        ),
      );

      toast.success(`User role changed to ${newRole}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // ✅ Table Columns
  const userColumns = [
    { header: "Username", accessor: "username" },
    {
      header: "Name",
      accessor: "fullName",
      render: (user) => user.fullName,
      filterValue: (user) => user.fullName,
    },
    { header: "Email", accessor: "email" },
    {
      header: "Status",
      accessor: "statusText",
      render: (user) => {
        const isActive = user.isActive;
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {user.statusText}
          </span>
        );
      },
      filterValue: (user) => user.statusText, // ✅ important fix
    },
    { header: "Role", accessor: "role" },
    {
      header: "Action",
      align: "text-center",
      render: (user) => {
        const userId = user.id;
        const isUpdating = updatingUserId === userId;
        const isSelf = currentUserId === userId;

        return (
          <div className="flex justify-center gap-3">
            {/* Toggle Active */}
            <button
              disabled={isUpdating || isSelf}
              className={`px-3 py-1 rounded border font-medium transition
                ${
                  isUpdating || isSelf
                    ? "opacity-50 cursor-not-allowed"
                    : user.isActive
                    ? "border-red-400 text-red-600 bg-white hover:bg-red-50"
                    : "border-green-400 text-green-600 bg-white hover:bg-green-50"
                }`}
              title={isSelf ? "You cannot block yourself" : ""}
              onClick={() => handleToggleActive(userId)}
            >
              {isUpdating
                ? "Updating..."
                : user.isActive
                ? "Block"
                : "Activate"}
            </button>

            {/* Toggle Role */}
            <button
              disabled={isUpdating || isSelf}
              className={`px-3 py-1 rounded border font-medium transition
                ${
                  isUpdating || isSelf
                    ? "opacity-50 cursor-not-allowed"
                    : user.role === "ADMIN"
                    ? "border-amber-400 text-amber-700 bg-white hover:bg-amber-50"
                    : "border-indigo-400 text-indigo-700 bg-white hover:bg-indigo-50"
                }`}
              title={
                isSelf ? "You cannot change your own role from this page" : ""
              }
              onClick={() => handleToggleRole(userId)}
            >
              {isUpdating
                ? "Updating..."
                : user.role === "ADMIN"
                ? "Make User"
                : "Make Admin"}
            </button>

            {/* Delete */}
            <button
              disabled={isUpdating || isSelf}
              className={`px-3 py-1 rounded border font-medium transition
                ${
                  isUpdating || isSelf
                    ? "opacity-50 cursor-not-allowed"
                    : "border-red-400 text-red-600 bg-white hover:bg-red-50"
                }`}
              onClick={() => handleDeleteUser(userId)}
            >
              {isUpdating ? "Updating..." : "Delete"}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <DashboardLayout pageTitle="Admin Dashboard">
      <div className="space-y-6">
        {error && (
          <div className="rounded-lg px-4 py-3 bg-amber-50 border border-amber-200 text-amber-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-slate-600 dark:text-slate-300">
            Loading...
          </div>
        ) : (
          <SectionCard
            title="Users"
            actionButton={
              <button
                onClick={handleAddUser}
                className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition font-medium"
              >
                Add User
              </button>
            }
          >
            <Table columns={userColumns} data={userList} />
          </SectionCard>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;