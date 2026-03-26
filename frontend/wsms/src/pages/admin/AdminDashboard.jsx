import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import StatsCard from "../../components/StatsCard";
import Table from "../../components/Table";
import SectionCard from "../../components/SectionCard";
import useAdminDashboard from "../../hooks/useAdminDashboard";

const serverColumns = [
  { header: "Server ID", accessor: "id" },
  { header: "Name", accessor: "serverName" },
  { header: "IP", accessor: "ipAddress", className: "font-mono" },
  { header: "Status", accessor: "status" },
  { header: "Owner", accessor: "username" },
];

const userColumns = [
  { header: "User ID", accessor: "id" },
  {
    header: "UserName",
    accessor: "username",
  },
  {
    header: "Name",
    render: (user) => user.fullName || "-",
  },
  { header: "Email", accessor: "email" },
  {
    header: "Status",
    render: (user) => (user.isVerified ? "Verified" : "Unverified"),
  },
  { header: "Role", accessor: "role" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { servers, users, loading, error } = useAdminDashboard();

  const stats = useMemo(() => {
    const totalServers = servers.length;
    const activeServers = servers.filter(
      (s) => s.status?.toLowerCase() === "active",
    ).length;
    const inactiveServers = servers.filter(
      (s) => s.status?.toLowerCase() === "inactive",
    ).length;
    const totalUsers = users.length;

    return { totalServers, activeServers, inactiveServers, totalUsers };
  }, [servers, users]);

  return (
    <DashboardLayout pageTitle="Admin Dashboard">
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Master overview for platform users and servers.
            </p>
          </div>

        </div>

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
            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard title="Total Servers" value={stats.totalServers} />
              <StatsCard title="Active Servers" value={stats.activeServers} />
              <StatsCard
                title="Inactive Servers"
                value={stats.inactiveServers}
              />
              <StatsCard title="Total Users" value={stats.totalUsers} />
            </div>

            {/* TABLES */}
            <SectionCard
              title="Servers"
              actionButton={
                <button
                  onClick={() => navigate("/admin/servers")}
                  className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition font-medium"
                >
                  Manage servers
                </button>
              }
            >
              <Table columns={serverColumns} data={servers} />
            </SectionCard>

            <SectionCard
              title="Users"
              actionButton={
                <button
                  onClick={() => navigate("/admin/users")}
                  className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition font-medium"
                >
                  Manage users
                </button>
              }
            >
              <Table columns={userColumns} data={users} />
            </SectionCard>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
