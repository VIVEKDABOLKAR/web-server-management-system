import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import SidebarHeader from "./SidebarHeader.jsx";
import SidebarMenu from "./SidebarMenu.jsx";
import SidebarFooter from "./SidebarFooter.jsx";
import menuItems from "./menuItems.jsx";
import { isAdminToken } from "../../utils/auth";

/** Dashboard sidebar */
const Sidebar = ({ isOpen, toggleOpen }) => {
    const location = useLocation();
    const [expandedMenu, setExpandedMenu] = useState(null);
    const token = localStorage.getItem("token");
    const isAdmin = isAdminToken(token);

    const filteredMenuItems = menuItems.filter((item) => !item.adminOnly || isAdmin);

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
                <button
                    onClick={toggleOpen}
                    className="fixed top-3 left-4 z-50 p-2  rounded-md bg-white dark:bg-slate-800 shadow-md border-2 border-gray-400 "
                >
                    ☰
                </button>
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
                        menuItems={filteredMenuItems}
                        expandedMenu={expandedMenu}
                        toggleSubmenu={toggleSubmenu}
                        isActive={isActive}
                        handleLinkClick={handleLinkClick}
                    />

                    <SidebarFooter isActive={isActive} handleLinkClick={handleLinkClick} />
                </div>
            )}
        </>
    );
};

export default Sidebar;