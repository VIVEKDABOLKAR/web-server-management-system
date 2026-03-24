const ServerInfoCard = ({ server }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded shadow border border-gray-200 dark:border-slate-700">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-slate-700">
        Server Information
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            IP Address:
          </span>
          <span className="font-mono text-sm bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
            {server.ipAddress}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            Status:
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              server.status === "active"
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
            }`}
          >
            {server.status}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            OS Type:
          </span>
          <span className="text-gray-800 dark:text-gray-200">
            {server.osType}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            Web Server:
          </span>
          <span className="text-gray-800 dark:text-gray-200">
            {server.webServerType}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            Created At:
          </span>
          <span className="text-gray-800 dark:text-gray-200">
            {new Date(server.createdAt).toLocaleDateString()}
          </span>
        </div>
        {server.description && (
          <div className="pt-2 border-t border-gray-200 dark:border-slate-700">
            <span className="text-gray-600 dark:text-gray-400 font-medium block mb-1">
              Description:
            </span>
            <span className="text-gray-800 dark:text-gray-200">
              {server.description}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerInfoCard;
