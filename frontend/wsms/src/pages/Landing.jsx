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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-900 shadow-md border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center shadow">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
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
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold shadow"
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
            <span className="text-blue-600 dark:text-blue-400">
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
              className="px-8 py-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-bold shadow text-lg"
            >
              Start Monitoring Free 🚀
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded hover:bg-gray-50 dark:hover:bg-slate-700 transition font-bold shadow border-2 border-gray-200 dark:border-slate-700 text-lg"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24">
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="text-blue-600 dark:text-blue-400">
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
                className="bg-white dark:bg-slate-800 p-8 rounded shadow transition border border-gray-200 dark:border-slate-700"
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
        <div className="mt-24 bg-blue-600 rounded p-12 shadow">
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
            <span className="text-blue-600 dark:text-blue-400">
              How It Works
            </span>
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 text-lg">
            Get started in minutes with our simple setup process
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow">
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
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow">
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
              <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow">
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
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow">
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
        <div className="mt-24 text-center bg-white dark:bg-slate-800 rounded p-12 shadow border border-gray-200 dark:border-slate-700">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-blue-600 dark:text-blue-400">
              Ready to Get Started?
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join now and start monitoring your servers in minutes
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="px-10 py-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-bold shadow text-lg"
          >
            Create Free Account →
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 mt-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
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
