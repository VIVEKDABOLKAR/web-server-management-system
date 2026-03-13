import { useState } from "react";
import api from "../../services/api";

const ProfileEditForm = ({ profile, onCancel, refresh, showToast }) => {

  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put("/api/users/profile", { fullName, email });

      showToast("Profile updated successfully", "success");

      refresh();
      onCancel();
    } catch (err) {
      showToast(err.response?.data?.trace || "Update failed", "error");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">

      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Edit Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

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
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Save Changes
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
};

export default ProfileEditForm;