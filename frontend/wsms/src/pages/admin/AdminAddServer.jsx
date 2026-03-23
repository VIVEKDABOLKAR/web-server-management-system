import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AddServerForm from "../../components/server/AddServerForm";
import TypeTable from "../../components/server/TypeTable";

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

  // Initialize
  useEffect(() => {
    fetchOsTypes();
    fetchWebServerTypes();
  }, []);

  useEffect(() => {
    if (osTypes.length > 0 && !formData.osType) {
      setFormData(prev => ({ ...prev, osType: osTypes[0] }));
    }
  }, [osTypes]);

  useEffect(() => {
    if (webServerTypes.length > 0 && !formData.webServerType) {
      setFormData(prev => ({ ...prev, webServerType: webServerTypes[0] }));
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
    const selected = osTypes.find(os => os.id === Number(e.target.value));
    setFormData(prev => ({ ...prev, osType: selected }));
  };

  const handleWebServerType = (e) => {
    const selected = webServerTypes.find(web => web.id === Number(e.target.value));
    setFormData(prev => ({ ...prev, webServerType: selected }));
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
        active: true
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
        active: true
      });

      setWebServerName("");
      fetchWebServerTypes();
      setWebSuccess("Web Server Type added successfully");

    } catch (err) {
      setWebSuccess("");
      setWebError(err.response?.data?.message || "Failed to add Web Server type");
    } finally {
      setManagerLoading(false);
    }
  };

 const handleToggleOsStatus = async (id) => {
  try {
    const selected = osTypes.find(os => os.id === id);
    
    const updatedOs = {
      ...selected,
      active: !selected.active
    };

    await api.put(`/api/ostypes/${id}`, updatedOs);

    // update UI
    setOsTypes(prev =>
      prev.map(item =>
        item.id === id ? updatedOs : item
      )
    );

  } catch (err) {
    console.error("Toggle failed", err);
  }
};

  const handleToggleWebStatus =async (id) => {
    try{
   const selected = webServerTypes.find(web => web.id === id);
    
    const updatedweb = {
      ...selected,
      active: !selected.active
    };

    await api.put(`/api/webtypes/${id}`, updatedweb);
    
     setWebServerTypes(prev =>
      prev.map(item =>
        item.id === id ? updatedweb : item
      )
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
              Admin - Server & Type Management
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Add new servers and manage OS/Web Server types
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* LEFT COLUMN: Add Server Form */}
            <AddServerForm
              title="Add New Server"
              formData={formData}
              osTypes={osTypes}
              webServerTypes={webServerTypes}
              loading={serverLoading}
              error={serverError}
              success={serverSuccess}
              onChange={handleChange}
              onSelectOs={handleOSType}
              onSelectWebServer={handleWebServerType}
              onCancel={() => navigate("/dashboard")}
              disabledSubmit
              spacious
            />

            {/* RIGHT COLUMN: Type Management */}
            <div className="space-y-6">

              {/* Add OS Type */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">
                  Manage OS Types
                </h2>

                {osSuccess && (
                  <div className="mb-4 text-sm text-green-700 bg-green-100 border border-green-200 rounded p-3">
                    {osSuccess}
                  </div>
                )}

                {osError && (
                  <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
                    {osError}
                  </div>
                )}

                <form onSubmit={handleAddOs} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      OS Type Name
                    </label>
                    <input
                      type="text"
                      value={osName}
                      onChange={(e) => setOsName(e.target.value)}
                      placeholder="e.g., LINUX, WINDOWS"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={managerLoading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
                  >
                    {managerLoading ? "Adding..." : "Add OS Type"}
                  </button>
                </form>
              </div>
              <TypeTable
                title="OS Types List"
                rows={osTypes}
                onToggleStatus={handleToggleOsStatus}
              />

              {/* Add Web Server Type */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">
                  Manage Web Server Types
                </h2>

                {webSuccess && (
                  <div className="mb-4 text-sm text-green-700 bg-green-100 border border-green-200 rounded p-3">
                    {webSuccess}
                  </div>
                )}

                {webError && (
                  <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
                    {webError}
                  </div>
                )}

                <form onSubmit={handleAddWebServer} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Web Server Type Name
                    </label>
                    <input
                      type="text"
                      value={webServerName}
                      onChange={(e) => setWebServerName(e.target.value)}
                      placeholder="e.g., APACHE, NGINX"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={managerLoading}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium"
                  >
                    {managerLoading ? "Adding..." : "Add Web Server Type"}
                  </button>
                </form>
              </div>
              <TypeTable
                title="Web Server Types List"
                rows={webServerTypes}
                onToggleStatus={handleToggleWebStatus}
              />

            </div>

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddServerAdmin;