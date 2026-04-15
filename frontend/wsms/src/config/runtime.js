const DEFAULT_API_BASE_URL = import.meta.env.PROD
  ? "https://web-server-management-system.onrender.com"
  : "http://localhost:8080";

const DEFAULT_WS_BASE_URL = import.meta.env.PROD
  ? "wss://web-server-management-system.onrender.com"
  : "ws://localhost:8080";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
export const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || DEFAULT_WS_BASE_URL;