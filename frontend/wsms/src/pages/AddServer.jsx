import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import AddServerForm from "../components/server/AddServerForm";

const AddServer = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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

  const handleChange = (e) => {

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  useEffect(() => {
    fetchOsTypes();
    fetchWebServerTypes();
  }, []);
  useEffect(() => {
    if (osTypes.length > 0) {
      setFormData(prev => ({
        ...prev,
        osType: osTypes[0]
      }));
    }
  }, [osTypes]);

  useEffect(() => {
    if (webServerTypes.length > 0) {
      setFormData(prev => ({
        ...prev,
        webServerType: webServerTypes[0]
      }));
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
    }
    catch (err) {
      console.error("Failed to fetch WebServer Types", err)
    }
  }
  const handleOSType = (e) => {
    
      const selected = osTypes.find(os => os.id === Number(e.target.value));
  
    setFormData(prev => ({  
      ...prev,
      osType: selected
    }));
  };
  const handleWebServerType = (e) => {
    const selected = webServerTypes.find(web => web.id === Number(e.target.value));
    setFormData(prev => ({
      ...prev,
      webServerType: selected
    }))
  }

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

      setError(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="w-full max-w-3xl px-4">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              Add Server
            </h1>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Register a new server for monitoring and management.
            </p>
          </div>

          <AddServerForm
            title="Add Server"
            formData={formData}
            osTypes={osTypes}
            webServerTypes={webServerTypes}
            loading={loading}
            error={error}
            success={success}
            onChange={handleChange}
            onSelectOs={handleOSType}
            onSelectWebServer={handleWebServerType}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/dashboard")}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddServer;