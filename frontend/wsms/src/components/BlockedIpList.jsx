import { useState, useEffect } from "react";
import api from "../services/api";

const BlockedIpList = ({ serverId }) => {
  const [blockedIps, setBlockedIps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIp, setNewIp] = useState({
    ipAddress: "",
    reason: "",
  });

  useEffect(() => {
    fetchBlockedIps();
  }, [serverId]);

  const fetchBlockedIps = async () => {
    try {
      const response = await api.get(`/api/blocked-ips/server/${serverId}`);
      setBlockedIps(response.data);
    } catch (err) {
      setError("Failed to fetch blocked IPs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockIp = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/blocked-ips", {
        serverId,
        ...newIp,
      });
      setNewIp({ ipAddress: "", reason: "" });
      setShowAddForm(false);
      fetchBlockedIps();
    } catch (err) {
      setError("Failed to block IP");
      console.error(err);
    }
  };

  const handleUnblockIp = async (ipId) => {
    try {
      await api.delete(`/api/blocked-ips/${ipId}`);
      fetchBlockedIps();
    } catch (err) {
      setError("Failed to unblock IP");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Blocked IPs</h2>
        <p className="text-gray-500">Loading blocked IPs...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4 pb-2 border-b">
        <h2 className="text-xl font-bold text-gray-800">Blocked IPs</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
        >
          {showAddForm ? "Cancel" : "+ Block New IP"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showAddForm && (
        <form
          onSubmit={handleBlockIp}
          className="mb-4 p-4 bg-gray-50 rounded-lg"
        >
          <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-2">
              IP Address
            </label>
            <input
              type="text"
              value={newIp.ipAddress}
              onChange={(e) =>
                setNewIp({ ...newIp, ipAddress: e.target.value })
              }
              placeholder="e.g., 192.168.1.100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-2">
              Reason (Optional)
            </label>
            <input
              type="text"
              value={newIp.reason}
              onChange={(e) => setNewIp({ ...newIp, reason: e.target.value })}
              placeholder="e.g., Suspicious activity detected"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium"
          >
            Block IP
          </button>
        </form>
      )}

      {blockedIps.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No blocked IPs</p>
      ) : (
        <div className="space-y-3">
          {blockedIps.map((ip) => (
            <div
              key={ip.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-lg font-semibold text-red-600">
                  {ip.ipAddress}
                </span>
                <button
                  onClick={() => handleUnblockIp(ip.id)}
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-green-500 text-white hover:bg-green-600 transition"
                >
                  Unblock
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-2">
                <span className="font-medium">Reason:</span>{" "}
                {ip.reason || "No reason provided"}
              </p>
              <p className="text-xs text-gray-400">
                Blocked on:{" "}
                {ip.blockedAt
                  ? new Date(ip.blockedAt).toLocaleString()
                  : "Unknown"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlockedIpList;
