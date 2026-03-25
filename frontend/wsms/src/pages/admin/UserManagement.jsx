import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Table from "../../components/Table";
import SectionCard from "../../components/SectionCard";
import useAdminDashboard from "../../hooks/useAdminDashboard";
import api from "../../services/api";
import { toast } from "react-toastify";
import Signup from "../auth/signUp/Signup";

const UserManagement = () => {
  const navigate = useNavigate();
  const { users, loading, error } = useAdminDashboard();

  const [userList, setUserList] = useState([]);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  useEffect(() => {
    const normalizedUsers = users.map((u) => ({
      ...u,
      isVerified: u.verified === true,
    }));

    setUserList(normalizedUsers);
  }, [users]);

  const handleAddUser = () => {
       navigate(
        `/admin/add-user`
      );
  };

  const handleToggleVerify = async (userId) => {
    try {
      setUpdatingUserId(userId);

      const user = userList.find((u) => u.id === userId);

      const newStatus = !user?.isVerified;

      await api.put(`/api/admin/users/${userId}/verify`, {
        verified: newStatus,
      });

      setUserList((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isVerified: newStatus } : u,
        ),
      );

      toast.success(
        `User ${newStatus ? "verified" : "unverified"} successfully`,
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update verification status");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const userColumns = [
    { header: "User ID", accessor: "id" },
    {
      header: "Name",
      render: (user) => user.fullName || user.username || "-",
    },
    { header: "Email", accessor: "email" },
    {
      header: "Status",
      render: (user) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            user.isVerified
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {user.isVerified ? "Verified" : "Unverified"}
        </span>
      ),
    },
    { header: "Role", accessor: "role" },
    {
      header: "Action",
      align: "text-center",
      render: (user) => {
        const userId = user.id;
        const isUpdating = updatingUserId === userId;

        return (
          <div className="flex justify-center">
            <button
              disabled={isUpdating}
              className={`px-3 py-1 rounded border font-medium transition
                ${
                  isUpdating
                    ? "opacity-50 cursor-not-allowed"
                    : "border-sky-400 text-sky-600 bg-white hover:bg-sky-50"
                }`}
              onClick={() => handleToggleVerify(userId)}
            >
              {isUpdating
                ? "Updating..."
                : user.isVerified
                  ? "Unverify"
                  : "Verify"}
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
                Add user
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
