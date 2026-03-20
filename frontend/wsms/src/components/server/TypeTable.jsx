const TypeTable = ({ title, rows = [], onToggleStatus }) => {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">{title}</h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-700">
              <th className="text-left text-sm font-semibold text-slate-700 dark:text-slate-200 px-4 py-3 border border-slate-200 dark:border-slate-600">ID</th>
              <th className="text-left text-sm font-semibold text-slate-700 dark:text-slate-200 px-4 py-3 border border-slate-200 dark:border-slate-600">Name</th>
              <th className="text-left text-sm font-semibold text-slate-700 dark:text-slate-200 px-4 py-3 border border-slate-200 dark:border-slate-600">Active</th>
              <th className="text-left text-sm font-semibold text-slate-700 dark:text-slate-200 px-4 py-3 border border-slate-200 dark:border-slate-600">Status</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-sm text-slate-500 dark:text-slate-400 px-4 py-4 border border-slate-200 dark:border-slate-600"
                >
                  No data available
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="text-sm text-slate-700 dark:text-slate-200 px-4 py-3 border border-slate-200 dark:border-slate-600">
                    {row.id}
                  </td>
                  <td className="text-sm text-slate-700 dark:text-slate-200 px-4 py-3 border border-slate-200 dark:border-slate-600">
                    {row.name}
                  </td>
                  <td className="text-sm px-4 py-3 border border-slate-200 dark:border-slate-600">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        row.active
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                      }`}
                    >
                      {row.active ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="text-sm px-4 py-3 border border-slate-200 dark:border-slate-600">
                    <button
                      type="button"
                      onClick={() => onToggleStatus?.(row.id)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                        row.active
                          ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300"
                          : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300"
                      }`}
                    >
                      {row.active ? "Deactive" : "Active"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TypeTable;
