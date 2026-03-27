import { useState, useEffect } from "react";
import api from "../../services/api";
import "./RequestLog.css";

const methods = ["ALL", "GET", "POST", "PUT", "DELETE"];

export default function RequestLog() {
  const [serverId, setServerId] = useState(1);
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(2);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [method, setMethod] = useState("ALL");
  const [servers, setServers] = useState([]);

  const fetchLogs = async () => {
    if (!serverId) return;
    try {
      let url = method === "ALL"
        ? `/api/request-logs/server/${serverId}`
        : `/api/request-logs/method/${method}`;
      const response = await api.get(url, { params: { serverId, page, size } });
      const data = response.data;
      console.log(data);
      setLogs(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, [page, serverId, method]);

  const fetchServers = async () => {
    try {
      const response = await api.get("/api/request-logs/server");
      setServers(response.data);
      console.log(response.data);
    } catch (err) {
      setError("Failed to Load");
    }
  };

  useEffect(() => { fetchServers(); }, []);

  return (
    <div className="rl-root">

      {/* Top bar */}
      <div className="rl-topbar">
        <div>
          <p className="rl-eyebrow">Monitoring</p>
          <h2 className="rl-title">Request Logs</h2>
          <p className="rl-subtitle">
            Showing <strong>{totalElements}</strong> total records
          </p>
        </div>
        <div className="rl-total-pill">
          <span className="rl-total-pill-label">Total</span>
          <span className="rl-total-pill-number">{totalElements}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="rl-toolbar">

        {/* Server select */}
        <div className="rl-select-wrap">
          <svg className="rl-select-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="2" width="14" height="11" rx="2" />
            <path d="M5 7h6M5 10h4" />
          </svg>
          <select
            className="rl-select"
            value={serverId || ""}
            onChange={(e) => { setServerId(Number(e.target.value)); setPage(0); }}
          >
            <option value="">Select Server</option>
            {servers.map((server) => (
              <option key={server.id} value={server.id}>{server.serverName}</option>
            ))}
          </select>
          <svg className="rl-chevron" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 8L1 3h10z" />
          </svg>
        </div>

        {/* Search button */}
        <button className="rl-btn-search" onClick={fetchLogs}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="7" cy="7" r="5" /><path d="M11 11l3 3" />
          </svg>
          Search
        </button>

        {/* Method segmented control */}
        <div className="rl-method-btns">
          {methods.map((m) => (
            <button
              key={m}
              className={`rl-method-btn ${method === m ? `active ${m}` : ""}`}
              onClick={() => { setMethod(m); setPage(0); }}
            >
              {m}
            </button>
          ))}
        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="rl-error">
          <svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="8" cy="8" r="6.5" />
            <path d="M8 5v3.5M8 11h.01" />
          </svg>
          {error}
        </div>
      )}

      {/* Table */}
      <div className="rl-card">
        <table className="rl-table">
          <thead>
            <tr>
              {["ID", "Server", "Method", "Endpoint", "Status", "Client IP", "Created At"].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6}><div className="rl-loading">Loading logs…</div></td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={6}><div className="rl-empty">No logs found for server {serverId}</div></td></tr>
            ) : (
              logs.map((log, i) => (
                <tr key={log.id} className={i % 2 === 0 ? "rl-row-even" : "rl-row-odd"}>
                  <td><span className="rl-cell-id">#{log.id}</span></td>
                  <td>
                    <span className="rl-cell-server">
                      <span className="rl-server-dot" />
                      {log.serverId}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${methodBadgeClass(log.method)}`}>{log.method}</span>
                  </td>
                  <td>
                    <span className="rl-cell-url" title={log.url}>{log.url}</span>
                  </td>
                  <td>
                    <span className={`badge ${statusBadgeClass(log.statusCode)}`}>{log.statusCode}</span>
                  </td>
                  <td><span className="rl-cell-ip">{log.clientIP}</span></td>
                  <td><span className="rl-cell-ts">{formatDate(log.timestamp)}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="rl-pagination">
        <span className="rl-page-info">
          page {totalPages >= 1 ? page + 1 : 0} / {totalPages}
        </span>
        <div className="rl-page-btns">
          <button className="rl-page-btn" onClick={() => setPage(0)} disabled={page === 0}>«</button>
          <button className="rl-page-btn" onClick={() => setPage((p) => p - 1)} disabled={page === 0}>Prev</button>
          <button className="rl-page-btn" onClick={() => setPage((p) => p + 1)} disabled={page + 1 >= totalPages}>Next</button>
          <button className="rl-page-btn" onClick={() => setPage(totalPages - 1)} disabled={page + 1 >= totalPages}>»</button>
        </div>
      </div>

    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────── */
const methodBadgeClass = (m) =>
  ({ GET: "badge-GET", POST: "badge-POST", PUT: "badge-PUT", DELETE: "badge-DELETE" }[m] || "badge-DEF");

const statusBadgeClass = (code) => {
  if (code >= 200 && code < 300) return "badge-2xx";
  if (code >= 400 && code < 500) return "badge-4xx";
  if (code >= 500) return "badge-5xx";
  return "badge-nxx";
};

const formatDate = (dt) => dt ? new Date(dt).toLocaleString() : "—";
