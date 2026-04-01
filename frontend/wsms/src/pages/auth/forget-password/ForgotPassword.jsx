import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../services/api";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1=email, 2=verify otp, 3=reset password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateEmail = () => {
    if (!email) {
      setError("Please enter your email.");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    return true;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateEmail()) return;

    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setSuccess("OTP sent to your email. Please check your inbox.");
      setStep(2);
    } catch (err) {
      console.error("Send OTP error:", err);
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp) {
      setError("Please enter the OTP you received.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/verify-otp", { email, otp });
      setSuccess("OTP verified. You can now reset your password.");
      setStep(3);
    } catch (err) {
      console.error("Verify OTP error:", err);
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill out all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const passwordStrongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordStrongRegex.test(newPassword)) {
      setError(
        "weak password" )
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      setSuccess("Password changed successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Reset password error:", err);
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-slate-800 dark:text-slate-200 font-semibold mb-2 text-sm"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full px-4 py-3 border border-slate-300/80 bg-white/60 dark:bg-slate-700/50 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-500 dark:focus:ring-orange-500/50 dark:border-slate-600 transition backdrop-blur-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-linear-to-r from-orange-600 to-red-700 py-3.5 text-white font-bold text-lg rounded-xl shadow-lg shadow-orange-500/30 transition hover:shadow-orange-500/40 hover:from-orange-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label
                htmlFor="otp"
                className="block text-slate-800 dark:text-slate-200 font-semibold mb-2 text-sm"
              >
                Verification Code
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the OTP from your email"
                className="w-full px-4 py-3 border border-slate-300/80 bg-white/60 dark:bg-slate-700/50 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-500 dark:focus:ring-orange-500/50 dark:border-slate-600 transition backdrop-blur-sm text-center text-2xl tracking-widest"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-linear-to-r from-orange-600 to-red-700 py-3.5 text-white font-bold text-lg rounded-xl shadow-lg shadow-orange-500/30 transition hover:shadow-orange-500/40 hover:from-orange-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm font-medium text-orange-700 dark:text-orange-400 hover:underline transition"
              >
                ← Back to email
              </button>
            </div>
          </form>
        );

      case 3:
        return (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-slate-800 dark:text-slate-200 font-semibold mb-2 text-sm"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 8 chars, uppercase, special char)"
                className="w-full px-4 py-3 border border-slate-300/80 bg-white/60 dark:bg-slate-700/50 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-500 dark:focus:ring-orange-500/50 dark:border-slate-600 transition backdrop-blur-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-slate-800 dark:text-slate-200 font-semibold mb-2 text-sm"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className="w-full px-4 py-3 border border-slate-300/80 bg-white/60 dark:bg-slate-700/50 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-500 dark:focus:ring-orange-500/50 dark:border-slate-600 transition backdrop-blur-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-linear-to-r from-orange-600 to-red-700 py-3.5 text-white font-bold text-lg rounded-xl shadow-lg shadow-orange-500/30 transition hover:shadow-orange-500/40 hover:from-orange-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-sm font-medium text-orange-700 dark:text-orange-400 hover:underline transition"
              >
                ← Back to verification
              </button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-100 via-amber-50 to-red-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl border border-white/30 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/60 p-8 md:p-10 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.25)] backdrop-blur-xl">
        <div className="text-center mb-8">
          
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Forgot Password?
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base">
            Enter your email to receive an OTP and reset your password.
          </p>
        </div>

        {error && (
          <div className="bg-red-100/90 dark:bg-red-900/40 border border-red-400 dark:border-red-700/80 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6 text-sm backdrop-blur-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100/90 dark:bg-green-900/40 border border-green-400 dark:border-green-700/80 text-green-700 dark:text-green-300 px-4 py-3 rounded-xl mb-6 text-sm backdrop-blur-sm">
            {success}
          </div>
        )}

        {renderStep()}

        <p className="text-center text-gray-600 dark:text-gray-300 mt-6">
          Remembered your password? {" "}
          <Link
            to="/login"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
