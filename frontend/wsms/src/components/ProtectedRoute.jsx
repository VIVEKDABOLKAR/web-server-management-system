import { useState } from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import NavbarDashboard from "./NavbarDashboard";


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
      const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // return children;

  return (
    // To Do :- later we shift sidebar to dashbar layout in route ; 
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 overflow-hidden">
            {/* Sidebar */}
            <div className=" inset-y-0 left-0 z-60">
                <Sidebar isOpen={sidebarOpen} toggleOpen={() => setSidebarOpen(!sidebarOpen)} />
            </div>
            

            {/* Main Content */}
            <main className="flex-1 flex flex-col ">
                  <NavbarDashboard />
                {/* Content Area */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
  )
};

export default ProtectedRoute;
