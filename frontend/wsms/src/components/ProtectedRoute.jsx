import { Navigate } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import NavbarDashboard from "./NavbarDashboard";
import { isAdminToken } from "../utils/auth";
import { useEffect } from "react";


const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem("token"); // insted of localStorage use cookies
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkRoute = async () => {
      if (!token) {
        return <Navigate to="/login" replace />;
      }


      if (requireAdmin && !await isAdminToken()) {
        return <Navigate to="/dashboard" replace />;
      } else {
        return children;
      }

    }

    checkRoute()
  })



  // return (
  //   // To Do :- later we shift sidebar to dashbar layout in route ; 
  //   <div className="flex h-screen bg-slate-100 dark:bg-slate-950 overflow-hidden">
  //           {/* Sidebar */}
  //           <div className=" inset-y-0 left-0 z-60">
  //               <Sidebar isOpen={sidebarOpen} toggleOpen={() => setSidebarOpen(!sidebarOpen)} />
  //           </div>


  //           {/* Main Content */}
  //           <main className="flex-1 flex flex-col ">
  //                 <NavbarDashboard />
  //               {/* Content Area */}
  //               <div className="flex-1 overflow-y-auto">
  //                   {children}
  //               </div>
  //           </main>
  //       </div>
  // )
};

export default ProtectedRoute;
