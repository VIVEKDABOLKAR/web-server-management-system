import { FiServer, FiShield, FiAlertCircle } from "react-icons/fi";

const AccountStats = ({ profile }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white dark:from-blue-700 dark:to-indigo-800 p-6 rounded-xl shadow">
        <FiServer className="text-2xl mb-2" />
        <p className="text-sm opacity-80">Total Servers</p>
        <p className="text-3xl font-bold">{profile.totalServers}</p>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white dark:from-green-700 dark:to-emerald-800 p-6 rounded-xl shadow">
        <FiShield className="text-2xl mb-2" />
        <p className="text-sm opacity-80">Active Servers</p>
        <p className="text-3xl font-bold">{profile.activeServers}</p>
      </div>

      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white dark:from-yellow-700 dark:to-orange-800 p-6 rounded-xl shadow">
        <FiAlertCircle className="text-2xl mb-2" />
        <p className="text-sm opacity-80">Total Alerts</p>
        <p className="text-3xl font-bold">{profile.totalAlerts}</p>
      </div>
    </div>
  );
};

export default AccountStats;
