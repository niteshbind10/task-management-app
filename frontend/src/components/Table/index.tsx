import React from "react";

interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (key: string, order: "asc" | "desc") => void;
  currentPage?: number;
  totalPages?: number;
  totalRecords?: number;
  onPageChange?: (page: number) => void;
}

function Table<T>({
  columns,
  data,
  loading = false,
  sortBy,
  sortOrder,
  onSort,
  currentPage,
  totalPages,
  totalRecords,
  onPageChange,
}: TableProps<T>) {
  const handleSortClick = (key: string) => {
    if (!onSort) return;
    const isCurrent = sortBy === key;
    const nextOrder = isCurrent && sortOrder === "asc" ? "desc" : "asc";
    onSort(key, nextOrder);
  };

  return (
    <div className="flex flex-col w-full glass-panel border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/80 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider select-none">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSortClick(col.key)}
                  className={`px-6 py-4 font-semibold ${col.sortable ? "cursor-pointer hover:bg-slate-800/40" : ""
                    }`}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && onSort && (
                      <span className="text-slate-500 text-[10px]">
                        {sortBy === col.key
                          ? sortOrder === "asc"
                            ? "▲"
                            : "▼"
                          : "⇅"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center">
                  <div className="flex justify-center items-center gap-3">
                    <div className="w-5 h-5 border-2 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
                    <span className="text-slate-400 font-medium tracking-wide">
                      Loading data...
                    </span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-16 text-center text-slate-500 tracking-wide"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-900/25 transition-colors duration-150"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {onPageChange && currentPage && totalPages && totalPages > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/30 text-xs text-slate-400 font-medium select-none">
          <div>
            Showing page <span className="text-slate-200 font-semibold">{currentPage}</span> of{" "}
            <span className="text-slate-200 font-semibold">{totalPages}</span>
            {totalRecords !== undefined && (
              <>
                {" "}
                (<span className="text-slate-200 font-semibold">{totalRecords}</span> total
                records)
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3.5 py-2 border border-slate-800 rounded-xl hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors duration-150 text-slate-300"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-3.5 py-2 border border-slate-800 rounded-xl hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors duration-150 text-slate-300"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
