import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAdminToken } from "../utils/auth";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      if (requireAdmin) {
        const admin = await isAdminToken();
        setIsAdmin(admin);
      }

      setLoading(false);
    };

    checkAccess();
  }, [token, requireAdmin]);

  //Wait until async check finishes
  if (loading) {
    return <div>Loading...</div>;
  }

  //No token → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  //Admin required but not admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  //Authorized
  return children;
};

export default ProtectedRoute;