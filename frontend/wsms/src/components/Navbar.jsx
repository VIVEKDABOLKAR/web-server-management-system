import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [showToast, setShowToast] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowToast(true);
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <>
      {showToast && (
        <Toast
          message="You have been logged out successfully!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className="text-2xl font-bold text-blue-600 cursor-pointer hover:text-blue-700"
              onClick={() => navigate("/dashboard")}
            >
              WSMS
            </div>
            {token && (
              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
