import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../../../services/api";

const VerifySignup = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email is required.");
      return;
    }

    if (!otp) {
      setError("Please enter the verification code sent to your email.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/signup/verify", { email, otp });
      setSuccess("Email verified successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Verify signup error:", err);
      setError(err.response?.data?.message || "Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-100 via-pink-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl border border-white/30 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/60 p-8 md:p-10 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.25)] backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="flex w-16 h-16 rounded-full bg-linear-to-br from-purple-200 to-pink-200 dark:from-purple-900/30 dark:to-pink-900/30 items-center justify-center mb-4">
            <p className="text-3xl">✉️</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Verify your email
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base">
            Enter the code sent to your email to complete account creation.
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-slate-800 dark:text-slate-200 font-semibold mb-2 text-sm"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-slate-300/80 bg-white/60 dark:bg-slate-700/50 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-500 dark:focus:ring-purple-500/50 dark:border-slate-600 transition backdrop-blur-sm"
              required
            />
          </div>

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
              placeholder="Enter the code sent to your email"
              className="w-full px-4 py-3 border border-slate-300/80 bg-white/60 dark:bg-slate-700/50 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-500 dark:focus:ring-purple-500/50 dark:border-slate-600 transition backdrop-blur-sm text-center text-2xl tracking-widest"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-linear-to-r from-purple-600 to-pink-700 py-3.5 text-white font-bold text-lg rounded-xl shadow-lg shadow-purple-500/30 transition hover:shadow-purple-500/40 hover:from-purple-700 hover:to-pink-800 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6 text-center">
          <p className="text-slate-700 dark:text-slate-300 text-sm">
            Already verified?{" "}
            <Link to="/login" className="font-bold text-purple-700 dark:text-purple-400 hover:underline transition">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifySignup;
