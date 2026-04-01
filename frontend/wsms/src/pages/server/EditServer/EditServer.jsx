import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import AddServerForm from "../../../components/server/AddServerForm";

import useServerForm from "../../../hooks/useServerForm";
import useServerTypes from "../../../hooks/useServerTypes";
import api from "../../../services/api";

const EditServer = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { osTypes, webServerTypes } = useServerTypes();

  const {
    formData,
    setFormData,
    handleChange,
    submit,
    loading,
    error,
    setIsEditMode,
  } = useServerForm(navigate);

  useEffect(() => {
    setIsEditMode(true);
  }, []);

  useEffect(() => {
    const fetchServer = async () => {
      try {
        const res = await api.get(`/api/servers/${id}`);

        const server = res.data;

        setFormData({
          serverName: server.serverName,
          ipAddress: server.ipAddress,
          osType: server.osType,
          webServerType: server.webServerType,
          webServerPortNo: server.webServerPortNo,
          description: server.description, 
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchServer();
  }, [id]);

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
      <div className="flex items-center justify-center">
        <div className="w-full max-w-3xl px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Edit Server
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Update server connection details and monitoring configuration.
            </p>
          </div>

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
              submit(id); 
            }}
            onCancel={() => navigate("/dashboard")}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditServer;
