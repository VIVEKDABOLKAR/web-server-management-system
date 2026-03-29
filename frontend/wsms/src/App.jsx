import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Landing from "./pages/Landing/Landing";
import Login from "./pages/auth/login/Login";
import ForgotPassword from "./pages/auth/forget-password/ForgotPassword";
import Signup from "./pages/auth/signUp/Signup";
import VerifySignup from "./pages/auth/signUp/VerifySignup";

import Dashboard from "./pages/user/Dashboard";
import AllServers from "./pages/server/AllServers/AllServers";
  import ServerDetails from "./pages/server/ServerDetails";
  import AddServer from "./pages/server/AddServer/AddServer";
import Profile from "./pages/profile/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Performance from "./pages/performance/Performance";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ServerSetup from "./pages/server/serverSetup/ServerSetup";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAddServer from "./pages/admin/AdminAddServer";
import UserManagement from "./pages/admin/UserManagement";
import ServerManagement from "./pages/admin/ServerManagement";
import EditServer from "./pages/server/EditServer/EditServer";
import AlertsPage from "./pages/alert/AlertsPage";
import AdminAddUser from "./pages/admin/AdminAddUser";
import Logout from "./pages/auth/logout/Logout";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./pages/layout/MainLayout";

import RequestLog from "./components/server/RequestLog";
import IpBlocks from "./components/server/IpBlocks";
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/verify" element={<VerifySignup />} />
        <Route path="/logout" element={<Logout />} />

        {/* Protected Routes with Layout */}
        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-servers"
            element={
              <ProtectedRoute>
                <AllServers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/performance"
            element={
              <ProtectedRoute>
                <Performance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alerts"
            element={
              <ProtectedRoute>
                <AlertsPage />
              </ProtectedRoute>
            }
          />
           <Route
                    path="/log"
                    element={
                      <ProtectedRoute>
                        <RequestLog />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/ipBlocks"
                    element={
                      <ProtectedRoute>
                        <IpBlocks />
                      </ProtectedRoute>
                    }
                  />
          <Route
            path="/add-server"
            element={
              <ProtectedRoute>
                <AddServer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/servers/:id"
            element={
              <ProtectedRoute>
                <ServerDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/server-setup/:serverId"
            element={
              <ProtectedRoute>
                <ServerSetup />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requireAdmin>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/servers"
            element={
              <ProtectedRoute requireAdmin>
                <ServerManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/form"
            element={
              <ProtectedRoute requireAdmin>
                <AdminAddServer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/editServers/:id"
            element={
              <ProtectedRoute requireAdmin>
                <EditServer />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        newestOnTop
        pauseOnFocusLoss={false}
        theme="colored"
      />

    </Router>
  );
}

export default App;