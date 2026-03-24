const Table = ({ columns, data, emptyMessage = "No data available" }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
        
        {/* HEADER */}
        <thead className="bg-slate-100 dark:bg-slate-700">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className={`px-4 py-3 font-semibold text-slate-800 dark:text-slate-100 ${
                  col.align || "text-left"
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-slate-500 dark:text-slate-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-4 py-3 text-slate-800 dark:text-slate-100 ${
                      col.className || ""
                    }`}
                  >
                    {col.render ? col.render(row) : row[col.accessor] || "-"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;