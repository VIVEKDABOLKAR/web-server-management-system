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
import AdminAddServer from "./pages/admin/AdminAddServer";
import UserManagement from "./pages/admin/UserManagement";
import ServerManagement from "./pages/admin/ServerManagement";
import EditServer from "./pages/server/EditServer/EditServer";
import AlertsPage from "./AlertsPage";
import { AdminAddUser } from "./pages/admin/AdminAddUser";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/verify" element={<VerifySignup />} />
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
        <Route path="/alerts" element={
          <ProtectedRoute>
            <AlertsPage />
          </ProtectedRoute>
        } />
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
          path="/admin/servers/:id"
          element={
            <ProtectedRoute requireAdmin>
              <EditServer  />
            </ProtectedRoute>
          }
        />
          <Route
          path="/admin/add-user"
          element={
            <ProtectedRoute requireAdmin>
              <AdminAddUser />
            </ProtectedRoute>
          }
        />
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
