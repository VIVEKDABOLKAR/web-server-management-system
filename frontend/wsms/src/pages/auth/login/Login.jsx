import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLoginMutation } from "../../../store/authApi";
import { isAdminToken } from "../../../utils/auth";

const Login = () => {
  const [formData, setFormData] = useState({
    credential: "",
    password: "",
  });
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [login, { isLoading, isSuccess, data, error }] = useLoginMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSuccess || !data?.token) return;

    localStorage.setItem("token", data.token);
    
    const handleNavigation = async () => {
      if (await isAdminToken()) {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    };

    const timer = setTimeout(() => {
      handleNavigation();
    }, 300);

    return () => clearTimeout(timer);
  }, [isSuccess, data, navigate]);



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.credential || !formData.password) {
      setFormError("All fields are required");
      return false;
    }
    if (formData.credential.length < 3) {
      setFormError("Username/email must be at least 3 characters");
      return false;
    }
    if (formData.password.length < 1) {
      setFormError("Password is required");
      return false;
    }
    if(!/\S+@\S+\.\S+/.test(formData.email)){
      setFormError("Please enter a valid email")
    }
    return true;
  };

  const getApiErrorMessage = () => {
    if (!error) {
      return "";
    }

    if (error.status === "FETCH_ERROR") {
      return "Cannot connect to server. Is the backend running on port 8080?";
    }

    if (error.status === 403) {
      if (
        typeof error.data === "string" &&
        error.data.toLowerCase().includes("blocked")
      ) {
        return "Your account has been blocked by admin.";
      }

      if (error.data?.message?.toLowerCase().includes("blocked")) {
        return "Your account has been blocked by admin.";
      }
    }

    if (typeof error.data === "string") {
      return error.data;
    }

    if (error.data?.message) {
      return error.data.message;
    }

    if (typeof error.status === "number") {
      return `Server error: ${error.status}`;
    }

    return "Login failed. Please try again.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      await login({...formData, email: formData.credential, username: formData.credential}).unwrap();
    } catch {
      // Handled via RTK Query mutation error state.
    }
  };

  const apiErrorMessage = getApiErrorMessage();
  const errorMessage = formError || apiErrorMessage;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 via-cyan-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-130  items-center">
        {/* Left: Illustration Placeholder */}
        {/* <div className="hidden md:flex flex-col items-center justify-center">
          <div className="w-full aspect-square rounded-3xl border-2 border-dashed border-cyan-400/40 dark:border-cyan-500/30 bg-linear-to-br from-cyan-100/30 to-blue-100/30 dark:from-slate-800/20 dark:to-slate-700/20 flex items-center justify-center backdrop-blur-sm">
            <div className="text-center">
              <p className="text-3xl mb-3">🔐</p>
              <p className="text-slate-600 dark:text-slate-300 font-medium">Login Illustration</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">(Download image and place here)</p>
            </div>grid grid-cols-1 md:grid-cols-2 gap-8
          </div>
        </div> */}

        {/* Right: Login Form */}
        <div className="w-full rounded-3xl border border-white/30 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/60 p-8 md:p-10 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.25)] backdrop-blur-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white text-center mb-2">
            Welcome Back
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-center mb-8 text-sm">
            Web Server Management System
          </p>

          {errorMessage && (
            <div className="bg-red-100/90 dark:bg-red-900/40 border border-red-400 dark:border-red-700/80 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6 text-sm backdrop-blur-sm">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100/90 dark:bg-green-900/40 border border-green-400 dark:border-green-700/80 text-green-700 dark:text-green-300 px-4 py-3 rounded-xl mb-6 text-sm backdrop-blur-sm">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="credential"
                className="block text-slate-800 dark:text-slate-200 font-semibold mb-2 text-sm"
              >
                Username or Email
              </label>
              <input
                type="text"
                id="credential"
                name="credential"
                value={formData.credential}
                onChange={handleChange}
                placeholder="Enter username or email"
                className="w-full rounded-xl border border-slate-300/80 bg-white/60 dark:bg-slate-700/50 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 dark:border-slate-600 dark:focus:ring-cyan-500/50 backdrop-blur-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-slate-800 dark:text-slate-200 font-semibold mb-2 text-sm"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-300/80 bg-white/60 dark:bg-slate-700/50 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 dark:border-slate-600 dark:focus:ring-cyan-500/50 backdrop-blur-sm"
                required
              />
            </div>

            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-cyan-700 dark:text-cyan-400 hover:underline transition"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-linear-to-r from-cyan-600 to-blue-700 py-3.5 text-white font-bold text-lg shadow-lg shadow-cyan-500/30 transition hover:shadow-cyan-500/40 hover:from-cyan-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
            <p className="text-center text-slate-700 dark:text-slate-300 text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-bold text-cyan-700 dark:text-cyan-400 hover:underline transition"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
