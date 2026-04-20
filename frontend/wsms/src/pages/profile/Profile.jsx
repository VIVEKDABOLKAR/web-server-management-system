import { useState, useEffect } from "react";
import api from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Toast from "../../components/Toast";

import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileInfo from "../../components/profile/ProfileInfo";
import ProfileEditForm from "../../components/profile/ProfileEditForm";
import AccountStats from "../../components/profile/AccountStats";
import SecuritySection from "../../components/profile/SecuritySection";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [toast, setToast] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/users/profile");
      console.log(res.data);
      setProfile(res.data);
    } catch {
      showToast("Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <DashboardLayout pageTitle="profile">
        <div className="rounded-2xl border border-slate-200 bg-white/85 p-8 text-center text-slate-500 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/75 dark:text-slate-300">
          Loading profile...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="profile">
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            User Profile
          </h1>
          <p className="text-gray-500 dark:text-gray-300 mt-1">
            Manage your account information and security settings.
          </p>
        </div>

        <ProfileHeader
          profile={profile}
          onEdit={() => setIsEditingProfile(true)}
        />

        {isEditingProfile ? (
          <ProfileEditForm
            profile={profile}
            onCancel={() => setIsEditingProfile(false)}
            refresh={fetchProfile}
            showToast={showToast}
          />
        ) : (
          <ProfileInfo profile={profile} />
        )}

        <AccountStats profile={profile} />

        {profile &&
              <SecuritySection showToast={showToast} />
        }

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
