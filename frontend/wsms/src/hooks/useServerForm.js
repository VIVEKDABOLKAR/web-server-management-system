// hooks/useServerForm.js
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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    if (!formData.serverName || !formData.ipAddress) {
      setError("Server name & IP required");
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await api.post("/api/servers", formData);

      navigate(`/server-setup/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed");
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
  };
};

export default useServerForm;