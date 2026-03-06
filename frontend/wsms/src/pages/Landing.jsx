import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDarkMode } from "../context/DarkModeContext";

const Landing = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const features = [
    {
      icon: "🖥️",
      title: "Real-Time Monitoring",
      description:
        "Monitor CPU, memory, disk usage, and system metrics in real-time with automatic updates every 30 seconds.",
    },
    {
      icon: "📊",
      title: "Performance Analytics",
      description:
        "Track server performance trends with detailed metrics and visual representations of system health.",
    },
    {
      icon: "🚨",
      title: "Smart Alerts",
      description:
        "Receive instant notifications when servers exceed critical thresholds or experience issues.",
    },
    {
      icon: "🔒",
      title: "IP Management",
      description:
        "Automatically block suspicious IPs and manage your server's security with built-in protection.",
    },
    {
      icon: "⚡",
      title: "Multi-Server Support",
      description:
        "Manage multiple servers from a single dashboard with easy navigation and comprehensive oversight.",
    },
    {
      icon: "📈",
      title: "Status Tracking",
      description:
        "Automatic server status updates based on performance metrics with color-coded indicators.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                WSMS
              </span>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                title={
                  isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
                }
              >
                {isDarkMode ? (
                  <span className="text-2xl">☀️</span>
                ) : (
                  <span className="text-2xl">🌙</span>
                )}
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Web Server Monitoring
            </span>
            <br />
            <span className="text-gray-800 dark:text-gray-100">
              Made Simple
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Monitor, manage, and optimize your web servers with real-time
            metrics, intelligent alerts, and comprehensive performance
            analytics—all from one powerful dashboard.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition font-bold shadow-2xl hover:shadow-3xl text-lg transform hover:-translate-y-1"
            >
              Start Monitoring Free 🚀
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition font-bold shadow-lg hover:shadow-xl border-2 border-gray-200 dark:border-slate-700 text-lg"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24">
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 text-lg">
            Everything you need to keep your servers running smoothly
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 border-2 border-gray-100 dark:border-slate-700"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-xl opacity-90">Real-Time Monitoring</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">30s</div>
              <div className="text-xl opacity-90">Auto-Refresh Interval</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">∞</div>
              <div className="text-xl opacity-90">Unlimited Servers</div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-24">
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 text-lg">
            Get started in minutes with our simple setup process
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                Sign Up
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create your free account in seconds
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                Add Server
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Register your server with simple details
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                Install Agent
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Deploy our lightweight monitoring agent
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
                4
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                Monitor
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Watch real-time metrics on your dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-24 text-center bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm rounded-3xl p-12 shadow-xl border-2 border-gray-100 dark:border-slate-700">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ready to Get Started?
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join now and start monitoring your servers in minutes
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition font-bold shadow-2xl text-lg transform hover:-translate-y-1"
          >
            Create Free Account →
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t-2 border-gray-200 dark:border-slate-700 mt-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                WSMS
              </span>
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              © 2026 Web Server Monitoring System. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
