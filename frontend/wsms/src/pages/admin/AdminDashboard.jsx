import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import StatsCard from "../../components/StatsCard";
import api from "../../services/api";

const AdminDashboard = () => {
	const navigate = useNavigate();
	const [servers, setServers] = useState([]);
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const loadData = async () => {
			setLoading(true);
			setError("");

			try {
				const [serversRes, usersRes] = await Promise.allSettled([
					api.get("/api/admin/servers"),
					api.get("/api/admin/users"),
				]);

				if (serversRes.status === "fulfilled") {
					setServers(Array.isArray(serversRes.value.data) ? serversRes.value.data : []);
				} else {
					const fallback = await api.get("/api/servers");
					setServers(Array.isArray(fallback.data) ? fallback.data : []);
				}

				if (usersRes.status === "fulfilled") {
					setUsers(Array.isArray(usersRes.value.data) ? usersRes.value.data : []);
				} else {
					const profileRes = await api.get("/api/users/profile");
					setUsers(profileRes.data ? [profileRes.data] : []);
					setError("Admin user list endpoint is not available yet. Showing limited user data.");
				}
			} catch (err) {
				setError(err.response?.data?.message || "Failed to load admin dashboard data");
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, []);

	const stats = useMemo(() => {
		const totalServers = servers.length;
		const activeServers = servers.filter((s) => s.status?.toLowerCase() === "active").length;
		const inactiveServers = servers.filter((s) => s.status?.toLowerCase() === "inactive").length;
		const totalUsers = users.length;

		return { totalServers, activeServers, inactiveServers, totalUsers };
	}, [servers, users]);

	return (
		<DashboardLayout pageTitle="Admin Dashboard">
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
					<div>
						<h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
						<p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
							Master overview for platform users, servers, and operational controls.
						</p>
					</div>
					<button
						onClick={() => navigate("/admin/add-server")}
						className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition font-medium"
					>
						Add Server
					</button>
				</div>

				{error && (
					<div className="rounded-lg px-4 py-3 bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-800">
						{error}
					</div>
				)}

				{loading ? (
					<div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent mx-auto mb-3" />
						<p className="text-slate-600 dark:text-slate-300">Loading admin data...</p>
					</div>
				) : (
					<>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
							<StatsCard title="Total Servers" value={stats.totalServers} variant="primary" icon="#" />
							<StatsCard title="Active Servers" value={stats.activeServers} variant="success" icon="#" />
							<StatsCard title="Inactive Servers" value={stats.inactiveServers} variant="danger" icon="#" />
							<StatsCard title="Total Users" value={stats.totalUsers} variant="subtle" icon="#" />
						</div>

						<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
							<section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
								<div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
									<h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Servers (Master Table)</h2>
								</div>
								<div className="overflow-x-auto">
									<table className="min-w-full text-sm">
										<thead className="bg-slate-50 dark:bg-slate-900">
											<tr>
												<th className="text-left px-4 py-3 font-semibold">Name</th>
												<th className="text-left px-4 py-3 font-semibold">IP</th>
												<th className="text-left px-4 py-3 font-semibold">Status</th>
												<th className="text-left px-4 py-3 font-semibold">Owner</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-slate-100 dark:divide-slate-700">
											{servers.length === 0 ? (
												<tr>
													<td colSpan={4} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">
														No servers available.
													</td>
												</tr>
											) : (
												servers.map((server) => (
													<tr key={server.id}>
														<td className="px-4 py-3 text-slate-800 dark:text-slate-100">{server.serverName}</td>
														<td className="px-4 py-3 text-slate-700 dark:text-slate-200 font-mono">{server.ipAddress}</td>
														<td className="px-4 py-3 text-slate-700 dark:text-slate-200">{server.status || "UNKNOWN"}</td>
														<td className="px-4 py-3 text-slate-700 dark:text-slate-200">{server.userId || "-"}</td>
													</tr>
												))
											)}
										</tbody>
									</table>
								</div>
							</section>

							<section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
								<div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
									<h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Users (Master Table)</h2>
								</div>
								<div className="overflow-x-auto">
									<table className="min-w-full text-sm">
										<thead className="bg-slate-50 dark:bg-slate-900">
											<tr>
												<th className="text-left px-4 py-3 font-semibold">Name</th>
												<th className="text-left px-4 py-3 font-semibold">Email</th>
												<th className="text-left px-4 py-3 font-semibold">Role</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-slate-100 dark:divide-slate-700">
											{users.length === 0 ? (
												<tr>
													<td colSpan={3} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">
														No users available.
													</td>
												</tr>
											) : (
												users.map((user) => (
													<tr key={user.id || user.email}>
														<td className="px-4 py-3 text-slate-800 dark:text-slate-100">{user.fullName || user.username || "-"}</td>
														<td className="px-4 py-3 text-slate-700 dark:text-slate-200">{user.email || "-"}</td>
														<td className="px-4 py-3 text-slate-700 dark:text-slate-200">{user.role || "USER"}</td>
													</tr>
												))
											)}
										</tbody>
									</table>
								</div>
							</section>
						</div>
					</>
				)}
			</div>
		</DashboardLayout>
	);
};

export default AdminDashboard;
