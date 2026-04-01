import { FiUser, FiMail } from "react-icons/fi";

const ProfileInfo = ({ profile }) => {
  if(profile == null) {
    return (
      <>
      </>
    )
  }
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">

      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Profile Information
      </h2>

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
            className={`px-3 py-1 text-sm rounded-full font-medium ${
              profile.verified
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
    </div>
  );
};

export default ProfileInfo;