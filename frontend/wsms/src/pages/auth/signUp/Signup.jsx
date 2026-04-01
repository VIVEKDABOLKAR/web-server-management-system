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
    <div className="min-h-screen bg-linear-to-br from-green-100 via-cyan-50 to-teal-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-130  items-center">
        {/* Left: Illustration Placeholder */}
        {/* <div className="hidden md:flex flex-col items-center justify-center order-2 md:order-1">
          <div className="w-full aspect-square rounded-3xl border-2 border-dashed border-green-400/40 dark:border-green-500/30 bg-linear-to-br from-green-100/30 to-cyan-100/30 dark:from-slate-800/20 dark:to-slate-700/20 flex items-center justify-center backdrop-blur-sm">
            <div className="text-center">
              <p className="text-3xl mb-3">📝</p>
              <p className="text-slate-600 dark:text-slate-300 font-medium">Signup Illustration</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">(Download image and place here)</p>
            </div>grid grid-cols-1 md:grid-cols-2 gap-8
          </div>
        </div> */}

        {/* Right: Signup Form */}
        <div className="w-full rounded-3xl border border-white/30 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/60 p-8 md:p-10 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.25)] backdrop-blur-xl order-1 md:order-2">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white text-center mb-2">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="text-slate-600 dark:text-slate-300 text-center mb-8 text-sm">
              {subtitle}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-semibold mb-2 text-sm">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300/80 bg-white/60 dark:bg-slate-700/50 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 dark:border-slate-600 dark:focus:ring-green-500/50 backdrop-blur-sm"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-semibold mb-2 text-sm">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300/80 bg-white/60 dark:bg-slate-700/50 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 dark:border-slate-600 dark:focus:ring-green-500/50 backdrop-blur-sm"
                placeholder="Enter full name (optional)"
              />
            </div>

            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-semibold mb-2 text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300/80 bg-white/60 dark:bg-slate-700/50 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 dark:border-slate-600 dark:focus:ring-green-500/50 backdrop-blur-sm"
                placeholder="Enter email"
                required
              />
            </div>

            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-semibold mb-2 text-sm">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300/80 bg-white/60 dark:bg-slate-700/50 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 dark:border-slate-600 dark:focus:ring-green-500/50 backdrop-blur-sm"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-linear-to-r from-green-600 to-teal-700 py-3.5 text-white font-bold text-lg shadow-lg shadow-green-500/30 transition hover:shadow-green-500/40 hover:from-green-700 hover:to-teal-800 disabled:cursor-not-allowed disabled:opacity-50 mt-6"
            >
              {isLoading ? "Creating..." : buttonText}
            </button>
          </form>

          {showLoginLink && (
            <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
              <p className="text-center text-slate-700 dark:text-slate-300 text-sm">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-green-700 dark:text-green-400 hover:underline transition">
                  Login
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;