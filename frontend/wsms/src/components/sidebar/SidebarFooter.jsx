import { Link } from "react-router-dom";
import { LogoutIcon, UserIcon } from "./SidebarIcons";


/** Sidebar bottom actions */
const SidebarFooter = ({ isActive, handleLinkClick }) => {
  return (
    <div className=" p-4 space-y-2">
      <Link
        to="/profile"
        onClick={handleLinkClick}
        className={`
          w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium
          ${
            isActive("/profile")
              ? "bg-sky-100 dark:bg-sky-900 text-sky-700"
              : "text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
          }
        `}
      >
        <UserIcon className="w-5 h-5" />
        Profile
      </Link>

      <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-900/20">
        <LogoutIcon className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
};

export default SidebarFooter;