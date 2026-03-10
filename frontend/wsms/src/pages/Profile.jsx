import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [toast, setToast] = useState(null);

  // Edit profile form
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // Change password form
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/api/users/profile");
      setProfile(response.data);
      setFullName(response.data.fullName);
      setEmail(response.data.email);
    } catch (err) {
      showToast("Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put("/api/users/profile", { fullName, email });
      showToast("Profile updated successfully", "success");
      setIsEditingProfile(false);
      fetchProfile();
    } catch (err) {
      showToast(
        err.response?.data?.trace || "Failed to update profile",
        "error",
      );
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    try {
      await api.put("/api/users/change-password", {
        currentPassword,
        newPassword,
      });
      showToast("Password changed successfully", "success");
      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      showToast(
        err.response?.data?.trace || "Failed to change password",
        "error",
      );
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-500 dark:text-gray-400 text-xl">
            Loading profile...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-8">
            User Profile
          </h1>

          {/* Profile Information Card */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded shadow mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Profile Information
              </h2>
              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold shadow"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {!isEditingProfile ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Full Name
                  </label>
                  <p className="text-lg text-gray-800 dark:text-gray-100">
                    {profile.fullName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Email
                  </label>
                  <p className="text-lg text-gray-800 dark:text-gray-100">
                    {profile.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Role
                  </label>
                  <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-semibold">
                    {profile.role}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Account Status
                  </label>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      profile.isVerified
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                    }`}
                  >
                    {profile.isVerified ? "✓ Verified" : "Not Verified"}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Member Since
                  </label>
                  <p className="text-lg text-gray-800 dark:text-gray-100">
                    {new Date(profile.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold shadow"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingProfile(false);
                      setFullName(profile.fullName);
                      setEmail(profile.email);
                    }}
                    className="px-4 py-2 bg-gray-500 dark:bg-slate-600 text-white rounded hover:bg-gray-600 dark:hover:bg-slate-700 transition font-semibold shadow"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Statistics Card */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded shadow mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Account Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {profile.totalServers}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Total Servers
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {profile.activeServers}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Active Servers
                </p>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded">
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {profile.totalAlerts}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Total Alerts
                </p>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Security
              </h2>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-semibold shadow"
                >
                  Change Password
                </button>
              )}
            </div>

            {!isChangingPassword ? (
              <p className="text-gray-600 dark:text-gray-400">
                Keep your account secure by regularly updating your password.
              </p>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-green-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-green-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    required
                    minLength="6"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    At least 6 characters
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-green-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-semibold shadow"
                  >
                    Change Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    className="px-4 py-2 bg-gray-500 dark:bg-slate-600 text-white rounded hover:bg-gray-600 dark:hover:bg-slate-700 transition font-semibold shadow"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default Profile;
