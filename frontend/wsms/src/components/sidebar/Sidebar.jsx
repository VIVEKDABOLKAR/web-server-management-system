import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SidebarHeader from "./SidebarHeader.jsx";
import SidebarMenu from "./SidebarMenu.jsx";
import SidebarFooter from "./SidebarFooter.jsx";
import UserMenuItems from "./UserMenuItems.jsx";
import AdminMenuItems from "./AdminMenuItems.jsx";
import { isAdminToken } from "../../utils/auth";

/** Dashboard sidebar with role-based menu selection */
const Sidebar = ({ isOpen, toggleOpen }) => {
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState(null);


const [menuItems, setMenuItems] = useState([]);

useEffect(() => {
  const loadMenu = async () => {
    const isAdmin = await isAdminToken();
    setMenuItems(isAdmin ? AdminMenuItems : UserMenuItems);
  };

  loadMenu();
}, []);

  const isActive = (path) => {
    if (path === "#") return false;
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const toggleSubmenu = (id) => {
    setExpandedMenu(expandedMenu === id ? null : id);
  };

  const handleLinkClick = () => {
    setExpandedMenu(null);
  };

  return (
    <>
      {/* hamburger icon */}
      {!isOpen ? (
        <>
        </>
      ) : (
        <div
          className={`
                        fixed md:relative left-0 top-0 h-screen w-64 z-50 md:z-0
                        bg-linear-to-b from-slate-500 to-slate-300 dark:from-slate-900 dark:to-slate-950 bg-fixed
                        border-r border-slate-200 dark:border-slate-700
                        shadow-2xl md:shadow-none
                        rounded-r-xl
                        transform transition-transform duration-300 ease-in-out
                        ${isOpen ? "translate-x-0" : "-translate-x-full"}
                        flex flex-col overflow-y-auto
                    `}
        >
          <SidebarHeader toggleOpen={toggleOpen} />
          <SidebarMenu
            menuItems={menuItems}
            expandedMenu={expandedMenu}
            toggleSubmenu={toggleSubmenu}
            isActive={isActive}
            handleLinkClick={handleLinkClick}
          />
          <SidebarFooter/>
        </div>
      )}
    </>
  );
};

export default Sidebar;
