import { useNavigate } from "react-router-dom";
import { LogoutIcon } from "./SidebarIcons";



/** Sidebar bottom actions */
const SidebarFooter = () => {
  const navigate = useNavigate();
  return (
    <div className=" p-4 space-y-2">
      <button
        onClick={() => navigate("/logout")}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <LogoutIcon className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
};

export default SidebarFooter;
