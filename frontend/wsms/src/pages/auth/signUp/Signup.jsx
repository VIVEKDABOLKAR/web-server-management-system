import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSignupMutation } from "../../../store/authApi";
import { toast } from "react-toastify";

const Signup = ({
  title = "Sign Up for WSMS",
  subtitle = "Web Server Monitoring System",
  showLoginLink = true,
  buttonText = "Sign Up",
}) => {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });


  const [signup, { isLoading, isSuccess}] =
    useSignupMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isSuccess) return;

    if (showLoginLink) {
      toast.success("Signup successful! Redirecting...");
      navigate(
        `/signup/verify?email=${encodeURIComponent(formData.email)}`
      );
    } else {
      toast.success("User created successfully!");
      navigate(
        `/admin/users`
      );

      setFormData({
        username: "",
        fullName: "",
        email: "",
        password: "",
      });
    }
  }, [isSuccess]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password) {
      return "Username, email and password are required";
    }
    if (formData.username.length < 3) {
      return "Username must be at least 3 characters";
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return "Please enter a valid email";
    }
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return null;
  };

  const getApiErrorMessage = (err) => {
    const defaultMessage = showLoginLink
      ? "Signup failed. Please try again."
      : "Failed to create user.";

    if (!err) return defaultMessage;

    if (err.status === "FETCH_ERROR") {
      return "Cannot connect to server.";
    }

    if (typeof err.data === "string") {
      return err.data;
    }

    if (err.data?.message) {
      return err.data.message;
    }

    return defaultMessage;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      await signup(formData).unwrap();
    } catch (err) {
      const msg = getApiErrorMessage(err);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-200 via-gray-100 to-zinc-200 dark:bg-slate-900 transition-colors flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white/90 p-8 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.35)] backdrop-blur-sm dark:bg-slate-800 dark:border-slate-700">

        {title && (
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white text-center mb-2">
            {title}
          </h2>
        )}

        {subtitle && (
          <p className="text-slate-600 dark:text-gray-300 text-center mb-6">
            {subtitle}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-slate-800 dark:text-gray-300 font-semibold mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
              placeholder="Enter username"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-slate-800 dark:text-gray-300 font-semibold mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
              placeholder="Enter full name (optional)"
            />
          </div>

          <div className="mb-4">
            <label className="block text-slate-800 dark:text-gray-300 font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
              placeholder="Enter email"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-slate-800 dark:text-gray-300 font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 py-3 text-white font-semibold shadow-lg shadow-cyan-500/25 transition hover:from-cyan-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Creating..." : buttonText}
          </button>
        </form>

       
        {showLoginLink && (
          <p className="mt-6 text-center text-slate-600 dark:text-gray-300">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-cyan-700 hover:text-cyan-800 hover:underline dark:text-blue-400">
              Login here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Signup;