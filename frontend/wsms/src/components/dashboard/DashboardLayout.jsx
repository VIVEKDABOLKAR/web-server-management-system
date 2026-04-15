import React from "react";
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
        <div className="flex min-h-full bg-linear-to-br from-slate-100 via-cyan-50 to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950 overflow-hidden" key={pageTitle}>

            {/* Main Content */}
            <main className="flex-1 flex flex-col ">
                {/* Content Area */}
                <div className="flex-1 overflow-auto">
                    <div className="max-w-7xl mx-auto px-4 py-8">

                    {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
