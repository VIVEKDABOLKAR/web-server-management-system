import { useEffect, useState } from "react";
import api from "../../services/api";

const IpBlocks = () => {
  const [serverId, setServerId] = useState(2);
  const [ipBlocks, setIpBlocks] = useState([]);
  const [servers, setServers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchIpBlocks = async () => {
    setLoading(true);
    try {
      setError("");
      const response = await api.get(`/api/ip-blocks/getIpblock/${serverId}`);
      console.log(response);
      setIpBlocks(response.data);
    } catch (err) {
      console.log(err);
      setError("Failed to load IP blocks");
    } finally {
      setLoading(false);
    }
  };

  const fetchServers = async () => {
    try {
      setError("");
      const response = await api.get("/api/request-logs/server");
      console.log(response);
      setServers(response.data);
    } catch (err) {
      console.log(err);
      setError("Failed to load servers");
    }
  };

  useEffect(() => {
    fetchServers();
    fetchIpBlocks();
  }, [serverId]);

  const handleIPBlock = async (clientIp) => {
    try {
      const response = await api.patch(
        `/api/ip-blocks/${serverId}/${clientIp}`,
      );
      setIpBlocks((prev) =>
        prev.map((item) => (item.clientIp === clientIp ? response.data : item)),
      );
    } catch (err) {
      setError("Failed to update IP block");
    }
  };
  const blockedCount = ipBlocks.filter((b) => b.status === "BLOCK").length;
  const unblockedCount = ipBlocks.filter((b) => b.status !== "BLOCK").length;

  return (
    <div className="max-w-6xl mx-auto px-8 py-10 bg-white dark:bg-slate-900 min-h-screen transition-colors">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-7 pb-6 border-b-2 border-slate-200 dark:border-slate-700">
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-rose-500 mb-1">
            Security
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1.5">
            IP Blocks
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Showing{" "}
            <span className="font-semibold text-rose-500">
              {ipBlocks.length}
            </span>{" "}
            blocked addresses
          </p>
        </div>
        <div className="flex items-center gap-6">
          {/* Blocked Card */}
          <div className="flex flex-col justify-between rounded-2xl min-w-[180px] h-[80px] px-6 py-3 bg-[#19192b] border-2 border-[#e53935]">
            <span className="text-xs font-bold uppercase tracking-widest text-[#e57373] mb-1">
              Blocked
            </span>
            <span className="text-2xl font-bold text-[#ff5252] font-mono leading-tight">
              {blockedCount}
            </span>
          </div>
          {/* Unblocked Card */}
          <div className="flex flex-col justify-between rounded-2xl min-w-[180px] h-[80px] px-6 py-3 bg-[#19192b] border-2 border-[#26a69a]">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4dd0e1] mb-1">
              Unblocked
            </span>
            <span className="text-2xl font-bold text-[#26ffe6] font-mono leading-tight">
              {unblockedCount}
            </span>
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        {/* Server select */}
        <div className="relative flex items-center">
          <svg
            className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="1" y="2" width="14" height="11" rx="2" />
            <path d="M5 7h6M5 10h4" />
          </svg>
          <select
            value={serverId || ""}
            onChange={(e) => setServerId(Number(e.target.value))}
            className="pl-9 pr-9 py-2.5 text-sm font-medium text-slate-800 dark:text-white bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl appearance-none outline-none cursor-pointer min-w-52 shadow-sm transition-all hover:border-indigo-400 dark:hover:border-indigo-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900"
          >
            <option value="">Select Server</option>
            {servers.map((server) => (
              <option key={server.id} value={server.id}>
                {server.serverName}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3 w-3 h-3 text-slate-400 pointer-events-none"
            viewBox="0 0 12 12"
            fill="currentColor"
          >
            <path d="M6 8L1 3h10z" />
          </svg>
        </div>

        {/* Refresh button */}
        <button
          onClick={fetchIpBlocks}
          className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-white font-semibold text-sm border-2 border-slate-300 dark:border-slate-600 rounded-xl shadow-sm transition-all hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-700 active:scale-95"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13.5 8a5.5 5.5 0 1 1-1.1-3.3" />
            <path d="M13.5 2.5V5.5H10.5" />
          </svg>
          Refresh
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-2 border-red-200 dark:border-red-700 rounded-xl px-5 py-3.5 mb-5 text-sm font-semibold">
          <svg
            className="w-4 h-4 flex-shrink-0"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <circle cx="8" cy="8" r="6.5" />
            <path d="M8 5v3.5M8 11h.01" />
          </svg>
          {error}
        </div>
      )}

      {/* ── Table card ── */}
      <div className="border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-800 shadow-lg shadow-slate-100 dark:shadow-slate-900/30">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-slate-100 dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-700">
            <tr>
              {[
                "#",
                "IP Address",
                "Server",
                "Last Request",
                "Status",
                "Action",
              ].map((h) => (
                <th
                  key={h}
                  className="px-5 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <div className="flex items-center justify-center gap-3 text-slate-400 font-medium text-sm">
                    <svg
                      className="w-5 h-5 animate-spin text-indigo-500"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Loading IP blocks…
                  </div>
                </td>
              </tr>
            ) : ipBlocks.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <svg
                      className="w-10 h-10 opacity-40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M4.93 4.93l14.14 14.14" />
                    </svg>
                    <span className="font-medium text-sm">
                      No blocked IPs for this server
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              ipBlocks.map((block, i) => (
                <tr
                  key={block.id}
                  className={`border-b border-slate-100 dark:border-slate-800 last:border-none transition-colors hover:bg-indigo-50 dark:hover:bg-slate-700 ${i % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-slate-50/60 dark:bg-slate-900/60"}`}
                >
                  {/* ID */}
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs font-semibold text-slate-400 dark:text-slate-500">
                      #{block.id}
                    </span>
                  </td>

                  {/* IP Address */}
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 font-mono text-sm font-bold text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-900 border-2 border-rose-200 dark:border-rose-700 rounded-lg px-3 py-1.5 whitespace-nowrap shadow-sm">
                      <svg
                        className="w-3.5 h-3.5 opacity-70 flex-shrink-0"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <circle cx="8" cy="8" r="6" />
                        <path d="M2 8h12M8 2a10 10 0 0 1 0 12M8 2a10 10 0 0 0 0 12" />
                      </svg>
                      {block.clientIp}
                    </span>
                  </td>

                  {/* Server */}
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-800 flex-shrink-0" />
                      {block.serverId}
                    </span>
                  </td>

                  {/* Last Request */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="font-mono text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md px-2.5 py-1">
                      {block.lastRequest
                        ? new Date(block.lastRequest).toLocaleString()
                        : "—"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    {block.status === "BLOCK" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-900 border-2 border-rose-200 dark:border-rose-700 rounded-lg px-3 py-1.5 whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-rose-400 animate-pulse flex-shrink-0" />
                        blocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900 border-2 border-emerald-200 dark:border-emerald-700 rounded-lg px-3 py-1.5 whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 flex-shrink-0" />
                        Unblock
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4">
                    {block.status === "UNBLOCK" ? (
                      <button
                        onClick={() => handleIPBlock(block.clientIp)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-900 border-2 border-rose-300 dark:border-rose-700 rounded-lg transition-all hover:bg-rose-600 dark:hover:bg-rose-700 hover:text-white hover:border-rose-600 dark:hover:border-rose-500 hover:shadow-md hover:shadow-rose-200 dark:hover:shadow-rose-900/30 active:scale-95"
                      >
                        <svg
                          className="w-3 h-3"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        >
                          <circle cx="8" cy="8" r="6.5" />
                          <path d="M5 8h6" />
                        </svg>
                        Block
                      </button>
                    ) : (
                      <button
                        onClick={() => handleIPBlock(block.clientIp)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900 border-2 border-emerald-300 dark:border-emerald-700 rounded-lg transition-all hover:bg-emerald-600 dark:hover:bg-emerald-700 hover:text-white hover:border-emerald-600 dark:hover:border-emerald-500 hover:shadow-md hover:shadow-emerald-200 dark:hover:shadow-emerald-900/30 active:scale-95"
                      >
                        <svg
                          className="w-3 h-3"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        >
                          <circle cx="8" cy="8" r="6.5" />
                          <path d="M5 8h6M8 5v6" />
                        </svg>
                        Unblock
                      </button>
                    )}
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

export default IpBlocks;
