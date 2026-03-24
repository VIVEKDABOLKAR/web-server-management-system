// hooks/useServerTypes.js
import { useEffect, useState } from "react";
import api from "../services/api";

const useServerTypes = () => {
  const [osTypes, setOsTypes] = useState([]);
  const [webServerTypes, setWebServerTypes] = useState([]);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      const [osRes, webRes] = await Promise.all([
        api.get("/api/ostypes"),
        api.get("/api/web-server-types"),
      ]);

      setOsTypes(osRes.data);
      setWebServerTypes(webRes.data);
    } catch (err) {
      console.error("Failed to fetch types", err);
    }
  };

  return { osTypes, webServerTypes, refresh: fetchTypes };
};

export default useServerTypes;