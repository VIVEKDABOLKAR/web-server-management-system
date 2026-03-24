export const decodeJwtPayload = (token) => {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

export const getUserRoleFromToken = (token) => {
  const payload = decodeJwtPayload(token);
  return payload?.role || "USER";
};

export const isAdminToken = (token) => getUserRoleFromToken(token) === "ADMIN";
