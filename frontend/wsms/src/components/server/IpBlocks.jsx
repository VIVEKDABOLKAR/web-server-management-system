import { useEffect, useState } from "react";
import api from "../../services/api";
import { FiRefreshCw, FiShield } from "react-icons/fi";
import PageSectionHeader from "../ui/PageSectionHeader";

const IpBlocks = () => {
  const [serverId, setServerId] = useState("");
  const [ipBlocks, setIpBlocks] = useState([]);
  const [servers, setServers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchIpBlocks = async () => {
    setLoading(true);
    try {
      setError("");
      if (serverId != "" ){
      const response = await api.get(`/api/ip-blocks/getIpblock/${serverId}`);
      console.log(response);
      setIpBlocks(response.data);
      }
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
      <div className="min-h-full bg-linear-to-br from-slate-100 via-cyan-50 to-blue-100 px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950">
      <div className="mx-auto max-w-7xl">
      <PageSectionHeader
        className="mb-8"
        eyebrow="Security"
        title="IP Blocks"
        description="Track suspicious clients and control network access per server."
        icon={<FiShield className="text-xl" />}
        badges={[
          { label: "Total", value: ipBlocks.length, tone: "indigo" },
          { label: "Blocked", value: blockedCount, tone: "rose" },
          { label: "Unblocked", value: unblockedCount, tone: "emerald" },
        ]}
        actions={(
          <button
            onClick={fetchIpBlocks}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:border-indigo-500 dark:hover:bg-slate-700 dark:hover:text-indigo-300"
          >
            <FiRefreshCw className="h-4 w-4" />
            Refresh
          </button>
        )}
      />

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
    </div>
  );
};

export default IpBlocks;
