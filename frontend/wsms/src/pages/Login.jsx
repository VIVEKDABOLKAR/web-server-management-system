import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLoginMutation } from "../store/authApi";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [login, { isLoading, isSuccess, data, error }] = useLoginMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    if (data?.token) {
      localStorage.setItem("token", data.token);
      setSuccessMessage("Login successful. Redirecting...");
      navigate("/dashboard");
      return;
    }

    setFormError("No token received from server");
  }, [isSuccess, data, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setFormError("All fields are required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setFormError("Please enter a valid email");
      return false;
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
      await login(formData).unwrap();
    } catch {
      // Handled via RTK Query mutation error state.
    }
  };

  const apiErrorMessage = getApiErrorMessage();
  const errorMessage = formError || apiErrorMessage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:bg-slate-900 transition-colors flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white/90 p-8 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.35)] backdrop-blur-sm dark:bg-slate-800 dark:border-slate-700">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white text-center mb-2">
          Login to WSMS
        </h2>
        <p className="text-slate-600 dark:text-gray-300 text-center mb-6">
          Web Server Monitoring System
        </p>

        {errorMessage && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-slate-800 dark:text-gray-300 font-semibold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-slate-800 dark:text-gray-300 font-semibold mb-2"
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
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
              required
            />
          </div>

          <div className="text-right mb-4">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-cyan-700 hover:text-cyan-800 hover:underline dark:text-blue-400"
            >
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 py-3 text-white font-semibold shadow-lg shadow-cyan-500/25 transition hover:from-cyan-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-600 dark:text-gray-300">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-cyan-700 hover:text-cyan-800 hover:underline dark:text-blue-400"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
