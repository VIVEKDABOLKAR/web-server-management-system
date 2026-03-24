import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSignupMutation } from "../../../store/authApi";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [signup, { isLoading, isSuccess, error }] = useSignupMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    setSuccessMessage("Signup successful. Redirecting to verification...");
    navigate(`/signup/verify?email=${encodeURIComponent(formData.email)}`);
  }, [isSuccess, formData.email, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password) {
      setFormError("Username, email and password are required");
      return false;
    }
    if (formData.username.length < 3) {
      setFormError("Username must be at least 3 characters");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setFormError("Please enter a valid email");
      return false;
    }
    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const getApiErrorMessage = () => {
    if (!error) {
      return "";
    }

    if (error.status === "FETCH_ERROR") {
      return "Cannot connect to server. Please ensure the backend is running on port 8080.";
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

    return "Signup failed. Please try again.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      };

      await signup(payload).unwrap();
    } catch {
      // Handled via RTK Query mutation error state.
    }
  };

  const apiErrorMessage = getApiErrorMessage();
  const errorMessage = formError || apiErrorMessage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-200 via-gray-100 to-zinc-200 dark:bg-slate-900 transition-colors flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white/90 p-8 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.35)] backdrop-blur-sm dark:bg-slate-800 dark:border-slate-700">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white text-center mb-2">
          Sign Up for WSMS
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
              htmlFor="username"
              className="block text-slate-800 dark:text-gray-300 font-semibold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="fullName"
              className="block text-slate-800 dark:text-gray-300 font-semibold mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name (optional)"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
            />
          </div>

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
              placeholder="Enter your password (min 6 characters)"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 py-3 text-white font-semibold shadow-lg shadow-cyan-500/25 transition hover:from-cyan-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-cyan-700 hover:text-cyan-800 hover:underline dark:text-blue-400"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
