import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Table from "../../components/Table";
import SectionCard from "../../components/SectionCard";
import useAdminDashboard from "../../hooks/useAdminDashboard";
import api from "../../services/api";

const UserManagement = () => {
  const navigate = useNavigate();
  const { users, loading, error } = useAdminDashboard();
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    setUserList(users);
  }, [users]);

  const handleToggleVerify = async (userId, currentStatus) => {
    try {
      await api.put(`/api/admin/users/${userId}/verify`, {
        isVerified: !currentStatus,
      });
      setUserList((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isVerified: !currentStatus } : user,
        ),
      );
    } catch (err) {
      alert("Failed to update verification status.");
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
      render: (user) => (user.isVerified ? "Verified" : "Unverified"),
    },
    { header: "Role", accessor: "role" },
    {
      header: "Action",
      align: "text-center",
      render: (user) => (
        <div className="flex justify-center">
          <button
            className="px-3 py-1 rounded border border-sky-400 text-sky-600 bg-white hover:bg-sky-50 transition font-medium"
            onClick={() => handleToggleVerify(user.id, user.isVerified)}
          >
            {user.isVerified ? "Unverify" : "Verify"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout pageTitle="Admin Dashboard">
      <div className="space-y-6">
        {/* ERROR */}
        {error && (
          <div className="rounded-lg px-4 py-3 bg-amber-50 border border-amber-200 text-amber-800">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="p-8 text-center text-slate-600 dark:text-slate-300">
            Loading...
          </div>
        ) : (
          <>
            <SectionCard
              title="Users"
              actionButton={
                <button
                  onClick={() => navigate("/admin/add-user")}
                  className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition font-medium"
                >
                  Add users
                </button>
              }
            >
              <Table columns={userColumns} data={userList} />
            </SectionCard>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;
