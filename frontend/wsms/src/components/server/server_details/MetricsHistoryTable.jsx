const MetricsHistoryTable = ({ metrics, latestMetrics }) => {
  if (!metrics || metrics.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded shadow border border-gray-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Metrics History ({metrics.length} records)
      </h3>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Last updated:{" "}
        {new Date(latestMetrics.createdAt).toLocaleString()}
      </div>
      <div className="mt-4 max-h-64 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-slate-700 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                Time
              </th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                CPU %
              </th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                Memory %
              </th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                Disk %
              </th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
              <tr
                key={metric.id}
                className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                  {new Date(metric.createdAt).toLocaleTimeString()}
                </td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                  {metric.cpuUsage.toFixed(1)}%
                </td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                  {metric.memoryUsage.toFixed(1)}%
                </td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                  {metric.diskUsage
                    ? metric.diskUsage.toFixed(1) + "%"
                    : "N/A"}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      metric.serverStatus === "ACTIVE"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : metric.serverStatus === "WARNING"
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {metric.serverStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MetricsHistoryTable;
