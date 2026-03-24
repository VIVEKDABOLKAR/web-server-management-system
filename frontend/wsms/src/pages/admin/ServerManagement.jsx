import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Table from "../../components/Table";
import SectionCard from "../../components/SectionCard";
import useAdminDashboard from "../../hooks/useAdminDashboard";

const serverColumns = (navigate) =>  [
  { header: "Server ID", accessor: "id" },
  { header: "Name", accessor: "serverName" },
  { header: "IP", accessor: "ipAddress", className: "font-mono" },
  { header: "Status", accessor: "status" },
  { header: "Owner", accessor: "userId" },
  {
    header: "Actions",
    align: "text-center",
    render: (server) => (
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => navigate(`/servers/${server.id}`)}
          className="px-3 py-1 rounded border border-sky-400 text-sky-600 bg-white hover:bg-sky-50 transition font-medium"
        >
          View
        </button>
        <button
          onClick={() => navigate(`/admin/servers/${server.id}`)}
          className="px-3 py-1 rounded border border-green-400 text-green-600 bg-white hover:bg-green-50 transition font-medium"
        >
          Edit
        </button>
        <button
          onClick={() => {
            /* delete logic here */
          }}
          className="px-3 py-1 rounded border border-pink-400 text-pink-600 bg-white hover:bg-pink-50 transition font-medium"
        >
          Delete
        </button>
      </div>
    ),
  },
];

const ServerManagement = () => {
  const navigate = useNavigate();
  const { servers, loading, error } = useAdminDashboard();

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
              title="Servers"
              actionButton={
                <button
                  onClick={() => navigate("/add-server")}
                  className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition font-medium"
                >
                  Add servers
                </button>
              }
            >
              <Table columns={serverColumns(navigate)} data={servers} />
            </SectionCard>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ServerManagement;
