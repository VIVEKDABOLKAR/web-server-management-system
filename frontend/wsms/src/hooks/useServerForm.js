import { useState } from "react";
import api from "../services/api";

const useServerForm = (navigate) => {
  const [formData, setFormData] = useState({
    serverName: "",
    ipAddress: "",
    osType: null,
    webServerType: null,
    webServerPortNo: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submit = async (id = null) => {
    try {
      setLoading(true);
      setError("");

      const payload = {
        serverName: formData.serverName,
        ipAddress: formData.ipAddress,
        description: formData.description,
        webServerPortNo: Number(formData.webServerPortNo),

        osType: {
          id: formData.osType?.id,
        },
        webServerType: {
          id: formData.webServerType?.id,
        },
      };

      if (isEditMode && id) {
        await api.put(`/api/servers/${id}`, payload);
      } else {
        await api.post("/api/servers", payload);
      }

      navigate("/admin/servers");
    } catch (err) {
      console.error("API ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    handleChange,
    submit,
    loading,
    error,
    setIsEditMode,
  };
};

export default useServerForm;
