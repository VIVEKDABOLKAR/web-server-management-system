import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../components/Navbar";
import DashboardLayout from "../components/dashboard/DashboardLayout";

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
    webServerPortNo: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!formData.serverName || !formData.ipAddress) {
      setError("Server name and IP address are required");
      return false;
    }

    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;

    if (!ipPattern.test(formData.ipAddress)) {
      setError("Please enter a valid IP address");
      return false;
    }

    if (!formData.webServerPortNo) {
      setError("Web server port number is required");
      return false;
    }

    if (isNaN(formData.webServerPortNo)) {
      setError("Port number must be numeric");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      await api.post("/api/servers", formData);

      setSuccess("Server added successfully!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      const responseData = err.response?.data;
      let errorMessage = "Failed to add server.";

      if (responseData?.message) {
        errorMessage = responseData.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="w-full max-w-3xl px-4">

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              Add Server
            </h1>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Register a new server for monitoring and management.
            </p>
          </div>

          {/* Form Card */}
          <div className="max-w-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-6">

            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded p-3">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Server Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Server Name
                </label>

                <input
                  type="text"
                  name="serverName"
                  value={formData.serverName}
                  onChange={handleChange}
                  placeholder="Production Web Server"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700"
                />
              </div>

              {/* IP Address */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  IP Address
                </label>

                <input
                  type="text"
                  name="ipAddress"
                  value={formData.ipAddress}
                  onChange={handleChange}
                  placeholder="192.168.1.100"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700"
                />
              </div>

              {/* OS Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Operating System
                </label>

                <select
                  name="osType"
                  value={formData.osType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                >
                  <option value="LINUX">Linux</option>
                  <option value="WINDOWS">Windows</option>
                </select>
              </div>

              {/* Web Server Type*/}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Web Server Type
                </label>

                <select
                  name="webServerType"
                  value={formData.webServerType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                >
                  <option value="APACHE">Apache</option>
                  <option value="NGINX">Nginx</option>
                  <option value="IIS">IIS</option>
                </select>
              </div>

              {/* Web Server Port  */}
              <div className="mb-4">
                <label
                  htmlFor="webServerPort"
                  className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                >
                  Web Server Port *
                </label>

                <input
                  type="number"
                  id="webServerPort"
                  name="webServerPort"
                  value={formData.webServerPortNo}
                  onChange={handleChange}
                  placeholder="e.g., 80, 443"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>

                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-2">

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add Server"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="px-5 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                >
                  Cancel
                </button>

              </div>

            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddServer;