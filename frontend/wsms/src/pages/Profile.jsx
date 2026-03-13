import { useState, useEffect } from "react";
import api from "../services/api";
import Toast from "../components/Toast";
import {
  FiUser,
  FiMail,
  FiShield,
  FiServer,
  FiAlertCircle,
  FiLock,
  FiEdit,
} from "react-icons/fi";
import DashboardLayout from "../components/dashboard/DashboardLayout";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [toast, setToast] = useState(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/users/profile");
      setProfile(res.data);
      setFullName(res.data.fullName);
      setEmail(res.data.email);
    } catch (err) {
      showToast("Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      await api.put("/api/users/profile", { fullName, email });
      showToast("Profile updated successfully", "success");
      setIsEditingProfile(false);
      fetchProfile();
    } catch (err) {
      showToast(err.response?.data?.trace || "Update failed", "error");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return showToast("Passwords do not match", "error");
    }

    if (newPassword.length < 6) {
      return showToast("Password must be at least 6 characters", "error");
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
      showToast(err.response?.data?.trace || "Password change failed", "error");
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <DashboardLayout pageTitle="profile">

      <div className="min-h-screen bg-gray-50 ">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            User Profile
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your account information and security settings.
          </p>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-6">

            {/* Avatar */}
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-600 text-white text-xl font-bold">
              {profile.fullName?.substring(0, 2).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800">
                {profile.fullName}
              </h2>

              <p className="text-gray-500">{profile.email}</p>

              <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                {profile.role}
              </span>
            </div>

            <button
              onClick={() => setIsEditingProfile(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <FiEdit />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Profile Information
          </h2>

          {!isEditingProfile ? (
            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-800 flex items-center gap-2">
                  <FiUser /> {profile.fullName}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800 flex items-center gap-2">
                  <FiMail /> {profile.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Account Status</p>
                <span
                  className={`px-3 py-1 text-sm rounded-full font-medium ${profile.verified
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {profile.verified ? "Verified" : "Not Verified"}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium text-gray-800">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>

            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-4">

              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Full Name"
                required
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Email"
                required
              />

              <div className="flex gap-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>

            </form>
          )}
        </div>

        {/* Account Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">

          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-xl shadow">
            <FiServer className="text-2xl mb-2" />
            <p className="text-sm opacity-80">Total Servers</p>
            <p className="text-3xl font-bold">{profile.totalServers}</p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-xl shadow">
            <FiShield className="text-2xl mb-2" />
            <p className="text-sm opacity-80">Active Servers</p>
            <p className="text-3xl font-bold">{profile.activeServers}</p>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-xl shadow">
            <FiAlertCircle className="text-2xl mb-2" />
            <p className="text-sm opacity-80">Total Alerts</p>
            <p className="text-3xl font-bold">{profile.totalAlerts}</p>
          </div>

        </div>

        {/* Security Section */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FiLock /> Security
            </h2>

            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Change Password
              </button>
            )}
          </div>

          {!isChangingPassword ? (
            <p className="text-gray-500">
              Use a strong password to keep your servers secure.
            </p>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">

              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                required
              />

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                required
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                required
              />

              <div className="flex gap-3">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                  Update Password
                </button>

                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>

            </form>
          )}

        </div>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;