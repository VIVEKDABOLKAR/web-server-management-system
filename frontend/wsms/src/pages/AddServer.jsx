import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

const AddServer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    serverName: "",
    ipAddress: "",
    osType: "LINUX",
    webServerType: "APACHE",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.serverName || !formData.ipAddress) {
      setError("Server name and IP address are required");
      return false;
    }
    // Basic IP validation
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipPattern.test(formData.ipAddress)) {
      setError("Please enter a valid IP address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log("Sending server data:", formData);
      await api.post("/api/servers", formData);
      setSuccess("Server added successfully!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Add server error:", err);
      console.error("Response data:", err.response?.data);
      console.error(
        "Full error response:",
        JSON.stringify(err.response?.data, null, 2),
      );

      // Extract validation errors if present
      const responseData = err.response?.data;
      let errorMessage = "Failed to add server. Please try again.";

      if (responseData?.message) {
        errorMessage = responseData.message;
      }

      // Check for field-specific validation errors
      if (responseData?.errors) {
        const fieldErrors = Object.entries(responseData.errors)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join(", ");
        errorMessage = `Validation errors: ${fieldErrors}`;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            ← Back to Dashboard
          </button>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Add New Server
            </h1>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="serverName"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Server Name *
                </label>
                <input
                  type="text"
                  id="serverName"
                  name="serverName"
                  value={formData.serverName}
                  onChange={handleChange}
                  placeholder="e.g., Production Web Server 1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="ipAddress"
                  className="block text-gray-700 font-medium mb-2"
                >
                  IP Address *
                </label>
                <input
                  type="text"
                  id="ipAddress"
                  name="ipAddress"
                  value={formData.ipAddress}
                  onChange={handleChange}
                  placeholder="e.g., 192.168.1.100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="osType"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Operating System *
                </label>
                <select
                  id="osType"
                  name="osType"
                  value={formData.osType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="LINUX">Linux</option>
                  <option value="WINDOWS">Windows</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="webServerType"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Web Server Type *
                </label>
                <select
                  id="webServerType"
                  name="webServerType"
                  value={formData.webServerType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="APACHE">Apache</option>
                  <option value="NGINX">Nginx</option>
                  <option value="IIS">IIS</option>
                </select>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter server description (optional)"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
                  disabled={loading}
                >
                  {loading ? "Adding Server..." : "Add Server"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddServer;
