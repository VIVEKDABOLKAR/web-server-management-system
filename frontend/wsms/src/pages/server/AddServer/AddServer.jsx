import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAdminToken } from "../../../utils/auth";

import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import AddServerForm from "../../../components/server/AddServerForm";

import useServerForm from "../../../hooks/useServerForm";
import useServerTypes from "../../../hooks/useServerTypes";

import useAdminDashboard from "../../../hooks/useAdminDashboard";

const AddServer = () => {
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const { users } = useAdminDashboard() 
  const { osTypes, webServerTypes } = useServerTypes();

  const { formData, setFormData, handleChange, submit, loading, error } =
    useServerForm(navigate);

  useEffect(() => {
    const fetchUser = async () => {
      if(await isAdminToken()) 
     setIsAdmin();

    }
    
    fetchUser()
  }, [])

  useEffect(() => {
    if (osTypes.length > 0 && !formData.osType) {
      setFormData((prev) => ({
        ...prev,
        osType: osTypes[0],
      }));
    }
  }, [osTypes]);

  useEffect(() => {
    if (webServerTypes.length > 0 && !formData.webServerType) {
      setFormData((prev) => ({
        ...prev,
        webServerType: webServerTypes[0],
      }));
    }
  }, [webServerTypes]);

  const handleOSType = (e) => {
    const selected = osTypes.find((os) => os.id === Number(e.target.value));

    setFormData((prev) => ({
      ...prev,
      osType: selected,
    }));
  };

  const handleWebServerType = (e) => {
    const selected = webServerTypes.find(
      (web) => web.id === Number(e.target.value),
    );

    setFormData((prev) => ({
      ...prev,
      webServerType: selected,
    }));
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

          {/* Form */}
          <AddServerForm
            formData={formData}
            osTypes={osTypes.filter((os) => os.active)}
            webServerTypes={webServerTypes.filter((web) => web.active)}
            loading={loading}
            error={error}
            success=""
            onChange={handleChange}
            onSelectOs={handleOSType}
            onSelectWebServer={handleWebServerType}
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            onCancel={() => navigate("/dashboard")}
            users={isAdmin ? users :  { users: [] }}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddServer;
