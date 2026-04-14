import axios from "axios";

const api = axios.create({
  baseURL: "https://web-server-management-system.onrender.com",
  headers: {
    "Content-Type": "application/json",
    "X-Client-Type": "WEB",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const url = config.url || "";

    if (token && !url.startsWith("/auth/")) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers?.Authorization) {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
