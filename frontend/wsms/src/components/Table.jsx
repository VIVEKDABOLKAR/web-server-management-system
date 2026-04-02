import { useMemo, useState } from "react";

const Table = ({
  columns,
  data,
  emptyMessage = "No data available",
  filterable = true,
}) => {
  const [filters, setFilters] = useState({});
  const [activeFilter, setActiveFilter] = useState(null);

  const filteredData = useMemo(() => {
    if (!filterable) return data;

    return data.filter((row) =>
      columns.every((col) => {
        if (!col.accessor || !filters[col.accessor]) return true;

        const value = col.filterValue
          ? col.filterValue(row)
          : row[col.accessor];

        return value
          ?.toString()
          .toLowerCase()
          .includes(filters[col.accessor].toLowerCase());
      }),
    );
  }, [data, filters, columns, filterable]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
        {/* HEADER */}
        <thead className="bg-slate-100 dark:bg-slate-700">
          <tr>
            {columns.map((col, index) => {
              const alignClass = col.align ? col.align : "text-left";

              const headerJustify =
                col.align === "text-center"
                  ? "justify-center"
                  : "justify-start";
              return (
                <th
                  key={index}
                  className={`px-4 py-3 font-semibold text-slate-800 dark:text-slate-100 ${alignClass}`}
                >
                  <span className={`flex items-center gap-1 ${headerJustify}`}>
                    {col.header}

                    {filterable && col.accessor && (
                      <button
                        type="button"
                        className="ml-1 p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                        onClick={() =>
                          setActiveFilter(
                            activeFilter === col.accessor ? null : col.accessor,
                          )
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M3 5a1 1 0 0 1 1-1h16a1 1 0 0 1 .8 1.6l-5.6 7.47V19a1 1 0 0 1-1.45.89l-4-2A1 1 0 0 1 9 17v-4.93L3.2 6.6A1 1 0 0 1 3 5Zm3.52 2L11 12.28V17.38l2 1V12.28L17.48 7H6.52Z"
                          />
                        </svg>
                      </button>
                    )}
                  </span>
                </th>
              );
            })}
          </tr>

          {filterable && (
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.accessor || idx}
                  className="bg-slate-50 dark:bg-slate-800 px-2 py-1"
                >
                  {activeFilter === col.accessor && col.accessor && (
                    <input
                      autoFocus
                      type="text"
                      placeholder={`Filter ${col.header}`}
                      value={filters[col.accessor] || ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          [col.accessor]: e.target.value,
                        }))
                      }
                      onBlur={() => setActiveFilter(null)}
                      className="px-2 py-1 border border-slate-300 dark:border-slate-600 rounded w-full text-xs focus:ring focus:border-sky-400"
                    />
                  )}
                </th>
              ))}
            </tr>
          )}
        </thead>

        {/* BODY */}
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-slate-500 dark:text-slate-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            filteredData.map((row, rowIndex) => (
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
