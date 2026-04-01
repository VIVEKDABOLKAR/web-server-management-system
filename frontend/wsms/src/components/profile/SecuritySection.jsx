import { useState } from "react";
import api from "../../services/api";
import { FiLock } from "react-icons/fi";

const SecuritySection = ({ showToast }) => {
  const [isChanging, setIsChanging] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return showToast("Passwords do not match", "error");
    }

    try {
      await api.put("/api/users/change-password", {
        currentPassword,
        newPassword,
      });

      showToast("Password changed successfully", "success");

      setIsChanging(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      showToast(err.response?.data?.trace || "Password change failed", "error");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
          <FiLock /> Security
        </h2>

        {!isChanging && (
          <button
            onClick={() => setIsChanging(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Change Password
          </button>
        )}
      </div>

      {!isChanging ? (
        <p className="text-gray-500 dark:text-gray-300">
          Use a strong password to keep your servers secure.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-gray-100 rounded-lg px-4 py-2"
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-gray-100 rounded-lg px-4 py-2"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-gray-100 rounded-lg px-4 py-2"
            required
          />

          <div className="flex gap-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
              Update Password
            </button>

            <button
              type="button"
              onClick={() => setIsChanging(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SecuritySection;
