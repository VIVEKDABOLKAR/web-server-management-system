import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Signup from "./pages/Signup";
import VerifySignup from "./pages/VerifySignup";
import Dashboard from "./pages/Dashboard";
import AllServers from "./pages/AllServers";
import ServerDetails from "./pages/ServerDetails";
import AddServer from "./pages/AddServer";
import Profile from "./pages/profile/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Performance from "./pages/Performance";
import "./App.css";
import ServerSetup from "./pages/ServerSetup";
import AdminAddServer from "./pages/admin/AdminAddServer"
import AlertsPage from "./AlertsPage";

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
          path="/adminAddServer"
          element={
            <ProtectedRoute>
              <AdminAddServer />
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
