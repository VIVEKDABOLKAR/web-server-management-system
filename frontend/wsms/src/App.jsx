import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/auth/login/Login"
import ForgotPassword from "./pages/auth/forget-password/ForgotPassword";
import Signup from "./pages/auth/signUp/Signup";
import VerifySignup from "./pages/auth/signUp/VerifySignup";
import Dashboard from "./pages/Dashboard";
import AllServers from "./pages/server/AllServers/AllServers";
  import ServerDetails from "./pages/server/ServerDetails";
  import AddServer from "./pages/server/AddServer/AddServer";
import Profile from "./pages/profile/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Performance from "./pages/performance/Performance";
  import AdminDashboard from "./pages/admin/AdminDashboard";
  import AdminAddServer from "./pages/admin/AdminAddServer";
import "./App.css";
import ServerSetup from "./pages/server/serverSetup/ServerSetup";
import ServerSetup from "./pages/ServerSetup";
import AdminAddServer from "./pages/admin/AdminAddServer"

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
            path="/adminAddServer"
            element={
            <ProtectedRoute>
              <AdminAddServer />
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
          path="/admin/add-server"
          element={
            <ProtectedRoute requireAdmin>
              <AdminAddServer />
            </ProtectedRoute>
          }
        />
      </Routes>
      
    </Router>
  );
}

export default App;
