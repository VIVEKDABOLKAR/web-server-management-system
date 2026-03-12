import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
// import Sidebar from "../Sidebar";


/**
 * DashboardLayout - Page-specific wrapper component for dashboard pages
 * Combines Sidebar + Dashboard content with responsive design
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Main content to display
 * @param {string} props.pageTitle - Optional page title
 * @returns {JSX.Element}
 */
const DashboardLayout = ({ children, pageTitle = "Dashboard" }) => {
    

    return (
        <div className="flex h-screen bg-slate-100 dark:bg-slate-950 overflow-hidden" key={pageTitle}>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-auto">
                {/* Content Area */}
                <div className="flex-1 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
