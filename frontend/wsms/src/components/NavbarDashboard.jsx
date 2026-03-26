import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Toast from "./Toast";
import { useDarkMode } from "../context/DarkModeContext";
import { isAdminToken } from "../utils/auth";

const NavbarDashboard = ({ hideDashboard = false }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [showToast, setShowToast] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/api/users/profile");
        setUserProfile(response.data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };


  const handleDashboardNavigation = () => {
    if (isAdminToken(token)) {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
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
      <nav className="bg-white dark:bg-slate-900 shadow-md border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={handleDashboardNavigation}
            >
              <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center shadow group-hover:shadow-lg transition">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                WSMS
              </span>
            </div>

            {/* Right side - Dashboard & Profile */}
            {token && (
              <div className="flex items-center gap-4">
                {!hideDashboard && (
                  <button
                    onClick={handleDashboardNavigation}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition hover:bg-blue-50 dark:hover:bg-slate-800 rounded"
                  >
                    Dashboard
                  </button>
                )}

                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                  title={
                    isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
                  }
                >
                  {isDarkMode ? (
                    <svg
                      className="w-5 h-5 text-gray-700 dark:text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-gray-700 dark:text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  )}
                </button>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded p-2 transition group"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow group-hover:shadow-lg transition">
                      {userProfile ? getInitials(userProfile.fullName) : "U"}
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {userProfile?.fullName || "User"}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {userProfile?.role || "USER"}
                      </div>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded shadow border border-gray-200 dark:border-slate-700 py-2 animate-fadeIn">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow">
                            {userProfile
                              ? getInitials(userProfile.fullName)
                              : "U"}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800 dark:text-gray-200">
                              {userProfile?.fullName || "User"}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {userProfile?.email || ""}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                            {userProfile?.role || "USER"}
                          </span>
                          {userProfile?.isVerified && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            navigate("/profile");
                            setShowDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-slate-700 transition flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <div>
                            <div className="font-medium">My Profile</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              View and edit your profile
                            </div>
                          </div>
                        </button>
                        <button
                            onClick={() => {
                            navigate("/logout");
                            setShowDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          <div>
                            <div className="font-medium">Logout</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Sign out of your account
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavbarDashboard;
