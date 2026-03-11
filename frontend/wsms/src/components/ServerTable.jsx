import React from "react";

const ServerTable = ({
  servers,
  filteredServers,
  searchTerm,
  onSearchChange,
  onView,
  onDelete,
  onAdd,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-md overflow-hidden">
      <div className="p-5 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Server Inventory</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              className="w-full sm:w-80 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Search servers..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <button
              onClick={onAdd}
              className="inline-flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition"
            >
              + Add Server
            </button>
          </div>
        </div>
      </div>

      {servers.length === 0 ? (
        <div className="p-10 text-center text-slate-600 dark:text-slate-300">
          No servers have been created yet. Add one to start monitoring.
        </div>
      ) : filteredServers.length === 0 ? (
        <div className="p-10 text-center text-slate-600 dark:text-slate-300">
          No servers match your search result.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 dark:bg-slate-900">
              <tr>
                <th className="px-5 py-4 font-semibold">Server Name</th>
                <th className="px-5 py-4 font-semibold">IP</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">OS</th>
                <th className="px-5 py-4 font-semibold">Web Server</th>
                <th className="px-5 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {filteredServers.map((server) => {
                const key = server.id || server._id || server.serverId;
                const status = server.status?.toLowerCase() || "unknown";
                const statusClasses =
                  status === "active"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : status === "blocked"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                    : status === "inactive"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";

                return (
                  <tr
                    key={key}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    onClick={() => onView(key)}
                  >
                    <td className="px-5 py-3 flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold uppercase text-xs">
                        {server.serverName?.charAt(0) || "?"}
                      </span>
                      <span className="font-medium text-slate-800 dark:text-slate-100">{server.serverName}</span>
                    </td>
                    <td className="px-5 py-3 font-mono text-sm text-slate-600 dark:text-slate-300">{server.ipAddress}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusClasses}`}>{server.status}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-700 dark:text-slate-200">{server.osType || "-"}</td>
                    <td className="px-5 py-3 text-slate-700 dark:text-slate-200">{server.webServerType || "-"}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(key);
                          }}
                          className="text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-sky-100 text-sm font-medium px-3 py-1 border border-sky-200 dark:border-slate-600 rounded"
                          aria-label="View details"
                        >
                          View
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(key, server.serverName);
                          }}
                          className="text-rose-600 dark:text-rose-300 hover:text-rose-800 dark:hover:text-rose-100 text-sm font-medium px-3 py-1 border border-rose-200 dark:border-slate-600 rounded"
                          aria-label="Delete server"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ServerTable;
