import { FiEdit } from "react-icons/fi";

const ProfileHeader = ({ profile, onEdit }) => {
  if(profile == null) {
    return (
      <>
      </>
    )
  }
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center gap-6">
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-600 text-white text-xl font-bold">
          {profile.fullName?.substring(0, 2).toUpperCase()}
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {profile.fullName}
          </h2>

          <p className="text-gray-500 dark:text-gray-300">{profile.email}</p>

          <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
            {profile.role}
          </span>
        </div>

        <button
          onClick={onEdit}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <FiEdit />
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
