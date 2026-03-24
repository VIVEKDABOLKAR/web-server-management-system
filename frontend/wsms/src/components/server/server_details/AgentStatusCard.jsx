const AgentStatusCard = ({ server }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded shadow border border-gray-200 dark:border-slate-700">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-slate-700">
        Agent Status
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            Agent Installed:
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              server.agentInstalled
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-400"
            }`}
          >
            {server.agentInstalled ? "✓ Installed" : "Not Installed"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            Last Heartbeat:
          </span>
          <span className="text-gray-800 dark:text-gray-200">
            {server.lastHeartbeat
              ? new Date(server.lastHeartbeat).toLocaleString()
              : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AgentStatusCard;
