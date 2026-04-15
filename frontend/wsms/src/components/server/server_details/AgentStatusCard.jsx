import { useNavigate } from "react-router-dom";

const AgentStatusCard = ({ server }) => {
  const navigate = useNavigate();

  const hasHeartbeat = Boolean(server?.lastHeartbeat);
  const heartbeatMs = hasHeartbeat
    ? Date.now() - new Date(server.lastHeartbeat).getTime()
    : null;
  const isNotResponding = hasHeartbeat && heartbeatMs > 5000;

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
            className={`px-3 py-1 rounded-full text-xs font-semibold ${hasHeartbeat
                ? isNotResponding
                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                  : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-400"
              }`}
          >
            {!hasHeartbeat
              ? "Not Installed"
              : isNotResponding
                ? "Not Responding"
                : "Installed"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            Last Heartbeat:
          </span>
          <span className="text-gray-800 dark:text-gray-200">
            {hasHeartbeat
              ? new Date(server.lastHeartbeat).toLocaleString()
              : "N/A"}
          </span>
        </div>

        {(!hasHeartbeat || isNotResponding ) && (
          <div className="pt-2">
            <button
              onClick={() =>
                navigate(`/server-setup/${server.id}`, {
                  state: { serverName: server.serverName },
                })
              }
              className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
            >
              Install Server Agent
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentStatusCard;
