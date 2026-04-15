import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import AddServerForm from "../../../components/server/AddServerForm";
import TypeTable from "../../../components/server/TypeTable";

const AddServerAdmin = () => {
  const navigate = useNavigate();

  // AddServer Form States
  const [serverLoading, setServerLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const [osTypes, setOsTypes] = useState([]);
  const [webServerTypes, setWebServerTypes] = useState([]);

  const [formData, setFormData] = useState({
    serverName: "",
    ipAddress: "",
    osType: null,
    webServerType: null,
    webServerPortNo: "",
    description: "",
  });

  // OS/Web Server Type Management States
  const [managerLoading, setManagerLoading] = useState(false);
  const [osError, setOsError] = useState("");
  const [osSuccess, setOsSuccess] = useState("");
  const [webError, setWebError] = useState("");
  const [webSuccess, setWebSuccess] = useState("");

  const [osName, setOsName] = useState("");
  const [webServerName, setWebServerName] = useState("");

  // condiational rendaring
  const [isManageOsTypeOpen, setIsManageOsTypeOpen] = useState(false);
  const [isManageWebServerTypeOpen, setIsManageWebServerTypeOpen] = useState(false);

  // Initialize
  useEffect(() => {
    fetchOsTypes();
    fetchWebServerTypes();
  }, []);

  useEffect(() => {
    if (osTypes.length > 0 && !formData.osType) {
      setFormData((prev) => ({ ...prev, osType: osTypes[0] }));
    }
  }, [osTypes]);

  useEffect(() => {
    if (webServerTypes.length > 0 && !formData.webServerType) {
      setFormData((prev) => ({ ...prev, webServerType: webServerTypes[0] }));
    }
  }, [webServerTypes]);

  const fetchOsTypes = async () => {
    try {
      const res = await api.get("/api/ostypes");
      setOsTypes(res.data);
    } catch (err) {
      console.error("Failed to fetch OS types", err);
    }
  };

  const fetchWebServerTypes = async () => {
    try {
      const response = await api.get("/api/web-server-types");
      setWebServerTypes(response.data);
    } catch (err) {
      console.error("Failed to fetch WebServer Types", err);
    }
  };

  // AddServer Handlers
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOSType = (e) => {
    const selected = osTypes.find((os) => os.id === Number(e.target.value));
    setFormData((prev) => ({ ...prev, osType: selected }));
  };

  const handleWebServerType = (e) => {
    const selected = webServerTypes.find(
      (web) => web.id === Number(e.target.value),
    );
    setFormData((prev) => ({ ...prev, webServerType: selected }));
  };

  const validateForm = () => {
    if (!formData.serverName || !formData.ipAddress) {
      setServerError("Server name and IP address are required");
      return false;
    }

    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;

    if (!ipPattern.test(formData.ipAddress)) {
      setServerError("Please enter a valid IP address");
      return false;
    }

    if (!formData.webServerPortNo) {
      setServerError("Web server port number is required");
      return false;
    }

    if (isNaN(formData.webServerPortNo)) {
      setServerError("Port number must be numeric");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError("");
    setServerSuccess("");

    if (!validateForm()) return;

    setServerLoading(true);

    try {
      const response = await api.post("/api/servers", formData);
      const serverId = response.data.id;
      navigate(`/server-setup/${serverId}`, {
        state: {
          serverName: formData.serverName,
          ipAddress: formData.ipAddress,
          osType: formData.osType,
          webServerType: formData.webServerType,
          webServerPortNo: formData.webServerPortNo,
        },
      });
    } catch (err) {
      const responseData = err.response?.data;
      let errorMessage = "Failed to add server.";

      if (responseData?.message) {
        errorMessage = responseData.message;
      }

      setServerError(errorMessage);
    } finally {
      setServerLoading(false);
    }
  };

  // OS Type Handlers
  const handleAddOs = async (e) => {
    e.preventDefault();
    setOsError("");
    setOsSuccess("");

    if (!osName) {
      setOsError("OS name is required");
      return;
    }

    try {
      setManagerLoading(true);

      await api.post("/api/ostypes", {
        name: osName,
        active: true,
      });

      setOsName("");
      fetchOsTypes();
      setOsSuccess("OS Type added successfully");
    } catch (err) {
      setOsSuccess("");
      setOsError(err.response?.data?.message || "Failed to add OS type");
    } finally {
      setManagerLoading(false);
    }
  };

  // Web Server Type Handlers
  const handleAddWebServer = async (e) => {
    e.preventDefault();
    setWebError("");
    setWebSuccess("");

    if (!webServerName) {
      setWebError("Web Server name is required");
      return;
    }

    try {
      setManagerLoading(true);

      await api.post("/api/web-server-types", {
        name: webServerName,
        active: true,
      });

      setWebServerName("");
      fetchWebServerTypes();
      setWebSuccess("Web Server Type added successfully");
    } catch (err) {
      setWebSuccess("");
      setWebError(
        err.response?.data?.message || "Failed to add Web Server type",
      );
    } finally {
      setManagerLoading(false);
    }
  };

  const handleToggleOsStatus = async (id) => {
    try {
      const selected = osTypes.find((os) => os.id === id);

      const updatedOs = {
        ...selected,
        active: !selected.active,
      };

      await api.put(`/api/ostypes/${id}`, updatedOs);

      // update UI
      setOsTypes((prev) =>
        prev.map((item) => (item.id === id ? updatedOs : item)),
      );
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  const handleToggleWebStatus = async (id) => {
    try {
      const selected = webServerTypes.find((web) => web.id === id);

      const updatedweb = {
        ...selected,
        active: !selected.active,
      };

      await api.put(`/api/webtypes/${id}`, updatedweb);

      setWebServerTypes((prev) =>
        prev.map((item) => (item.id === id ? updatedweb : item)),
      );
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
              Server & Configuration Management
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Add servers and manage system configurations
            </p>
          </div>

          {/* Main Grid: Form (Left) + Management Panels (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: Add Server Form (2 columns) */}
            <div className="lg:col-span-2">
              <AddServerForm
                formData={formData}
                osTypes={osTypes.filter((os) => os.active)}
                webServerTypes={webServerTypes.filter((web) => web.active)}
                loading={serverLoading}
                error={serverError}
                success={serverSuccess}
                onChange={handleChange}
                onSelectOs={handleOSType}
                onSelectWebServer={handleWebServerType}
                onSubmit={handleSubmit}
                onCancel={() => navigate("/dashboard")}
                isAdmin={true}
                disabledSubmit
                spacious={true}
              />
            </div>

            {/* RIGHT: Management Control Panel (1 column) */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6">
                Configuration Management
              </h2>

              {/* Manage OS Types - Dropdown Panel */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setIsManageOsTypeOpen(!isManageOsTypeOpen)}
                  className="w-full px-6 py-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                    OS Types
                  </h3>
                  <span className={`text-xl text-slate-500 transition-transform ${isManageOsTypeOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {isManageOsTypeOpen && (
                  <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 space-y-4">
                    {osSuccess && (
                      <div className="p-3 text-sm text-green-700 bg-green-100 border border-green-200 rounded-lg flex items-center gap-2">
                        <span>✓</span>
                        {osSuccess}
                      </div>
                    )}

                    {osError && (
                      <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                        <span>✕</span>
                        {osError}
                      </div>
                    )}

                    {/* Add OS Type Form */}
                    <form onSubmit={handleAddOs} className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-2 uppercase tracking-wide">
                          Add New OS Type
                        </label>
                        <input
                          type="text"
                          value={osName}
                          onChange={(e) => setOsName(e.target.value)}
                          placeholder="Linux, Windows, macOS..."
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={managerLoading}
                        className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 font-medium text-sm"
                      >
                        {managerLoading ? "Adding..." : "+ Add OS Type"}
                      </button>
                    </form>

                    {/* OS Types Table */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-400 mb-3 uppercase tracking-wide">
                        Existing OS Types
                      </h4>
                      <div className="space-y-2">
                        {osTypes.length > 0 ? (
                          osTypes.map((os) => (
                            <div
                              key={os.id}
                              className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 flex justify-between items-center"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                                  {os.name}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleToggleOsStatus(os.id)}
                                  className={`text-xs px-2 py-1 rounded transition font-medium ${os.active
                                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                  {os.active ? "Active" : "Inactive"}
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                            No OS types yet
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Manage Web Server Types - Dropdown Panel */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setIsManageWebServerTypeOpen(!isManageWebServerTypeOpen)}
                  className="w-full px-6 py-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                    Web Server Types
                  </h3>
                  <span className={`text-xl text-slate-500 transition-transform ${isManageOsTypeOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {isManageWebServerTypeOpen && (
                  <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 space-y-4">
                    {webSuccess && (
                      <div className="p-3 text-sm text-green-700 bg-green-100 border border-green-200 rounded-lg flex items-center gap-2">
                        <span>✓</span>
                        {webSuccess}
                      </div>
                    )}

                    {webError && (
                      <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                        <span>✕</span>
                        {webError}
                      </div>
                    )}

                    {/* Add Web Server Type Form */}
                    <form onSubmit={handleAddWebServer} className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-2 uppercase tracking-wide">
                          Add New Web Server Type
                        </label>
                        <input
                          type="text"
                          value={webServerName}
                          onChange={(e) => setWebServerName(e.target.value)}
                          placeholder="Apache, Nginx, IIS..."
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={managerLoading}
                        className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 font-medium text-sm"
                      >
                        {managerLoading ? "Adding..." : "+ Add Web Server Type"}
                      </button>
                    </form>

                    {/* Web Server Types Table */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-400 mb-3 uppercase tracking-wide">
                        Existing Web Server Types
                      </h4>
                      <div className="space-y-2">
                        {webServerTypes.length > 0 ? (
                          webServerTypes.map((web) => (
                            <div
                              key={web.id}
                              className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 flex justify-between items-center"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                                  {web.name}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleToggleWebStatus(web.id)}
                                  className={`text-xs px-2 py-1 rounded transition font-medium ${web.active
                                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                  {web.active ? "Active" : "Inactive"}
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                            No web server types yet
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddServerAdmin;
