import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/sidebar/Sidebar";

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
      await api.post("/api/servers", formData);
      setSuccess("Server added successfully!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      const responseData = err.response?.data;
      let errorMessage = "Failed to add server. Please try again.";

      if (responseData?.message) {
        errorMessage = responseData.message;
      }

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
      <div className="flex h-screen bg-slate-100 dark:bg-slate-950 overflow-hidden" >
        <div className="min-h-screen flex flex-1 bg-gray-50 dark:bg-slate-900">
          <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-8 rounded shadow">
              <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-6">
                Add New Server
              </h1>

              {error && (
                <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400 px-4 py-3 rounded mb-4">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="serverName"
                    className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
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
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="ipAddress"
                    className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
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
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="osType"
                    className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                  >
                    Operating System *
                  </label>
                  <select
                    id="osType"
                    name="osType"
                    value={formData.osType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    required
                  >
                    <option value="LINUX">Linux</option>
                    <option value="WINDOWS">Windows</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="webServerType"
                    className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                  >
                    Web Server Type *
                  </label>
                  <select
                    id="webServerType"
                    name="webServerType"
                    value={formData.webServerType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
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
                    className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
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
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow"
                    disabled={loading}
                  >
                    {loading ? "Adding Server..." : "Add Server"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddServer;
