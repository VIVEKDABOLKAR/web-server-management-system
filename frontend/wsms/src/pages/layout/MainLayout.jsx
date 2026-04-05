import { useState } from "react";
import NavbarDashboard from "../../components/NavbarDashboard";
import Sidebar from "../../components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";



const MainLayout = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleToggleOpenSidbar = () => {
        setSidebarOpen(!sidebarOpen)
    }
    return (
        <div className="flex h-screen bg-slate-100 dark:bg-slate-950 overflow-hidden">
            {/* Sidebar */}
            {sidebarOpen &&
            <div className=" inset-y-0 left-0 z-60">
                <Sidebar isOpen={sidebarOpen} toggleOpen={handleToggleOpenSidbar} className="transition-transform duration-500 ease-in"/>

            </div> 
            }
            {/* Main Content */}
            <main className="flex-1 flex flex-col ">
                <NavbarDashboard toggleOpenSidebar={handleToggleOpenSidbar} isOpenSidebar={sidebarOpen}/>
                {/* Content Area */}
                <div className="flex-1 overflow-y-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default MainLayout;