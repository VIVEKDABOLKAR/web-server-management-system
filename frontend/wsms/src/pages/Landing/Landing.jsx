import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDarkMode } from "../../context/DarkModeContext";
import heroLight from "../../assets/hero-light.png";
import heroDark from "../../assets/hero-dark.png";
import Button from "../../components/Button";
import NavLinkButton from "../../components/NavLinkButton";
import "./ScaleAndWorkSection.css";
import "./FeatureSection.css"
import "./GetStart.css";

//icon
import serverIcon from  "../../assets/svg/pc.svg"
import chartIcon from  "../../assets/svg/chart.svg"
import alertIcon from  "../../assets/svg/alert.svg"
import ipManageIcon from  "../../assets/svg/ipManage.svg"
import multiIcon from  "../../assets/svg/multi.svg"
import trackIcon from  "../../assets/svg/track.svg"

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

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const features = [
    {
      icon: <img src={serverIcon} className="w-10 h-10" />,
      title: "Real-Time Monitoring",
      description:
        "Monitor CPU, memory, disk usage, and system metrics in real-time with automatic updates every 30 seconds.",
    },
    {
      icon: <img src={chartIcon} className="w-10 h-10" />,
      title: "Performance Analytics",
      description:
        "Track server performance trends with detailed metrics and visual representations of system health.",
    },
    {
      icon: <img src={alertIcon} className="w-10 h-10" />,
      title: "Smart Alerts",
      description:
        "Receive instant notifications when servers exceed critical thresholds or experience issues.",
    },
    {
      icon: <img src={ipManageIcon} className="w-10 h-10" />,
      title: "IP Management",
      description:
        "Automatically block suspicious IPs and manage your server's security with built-in protection.",
    },
    {
      icon: <img src={multiIcon} className="w-10 h-10" />,
      title: "Multi-Server Support",
      description:
        "Manage multiple servers from a single dashboard with easy navigation and comprehensive oversight.",
    },
    {
      icon: <img src={trackIcon} className="w-10 h-10" />,
      title: "Status Tracking",
      description:
        "Automatic server status updates based on performance metrics with color-coded indicators.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[rgb(80,82,88)] transition-colors">
      {/* Navigation */}
      <nav className="sticky top-0 left-0 w-full z-50 bg-black/80 backdrop-blur border-b border-white/10  ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center shadow">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <span className="text-2xl font-bold text-white tracking-wide">
                WSMS
              </span>
            </div>

            {/* Section Links */}
            <div className="hidden md:flex items-center gap-12 text-white text-lg font-semibold tracking-wide ml-8">
              <NavLinkButton label="Home" section="home" scrollToSection={scrollToSection} />
              <NavLinkButton label="Features" section="features" scrollToSection={scrollToSection} />
              <NavLinkButton label="Stats" section="stats" scrollToSection={scrollToSection} />
              <NavLinkButton label="How It Works" section="how" scrollToSection={scrollToSection} />
              <NavLinkButton label="Get Started" section="cta" scrollToSection={scrollToSection} />
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Button
                text={isDarkMode ? "☀️" : "🌙"}
                onClick={toggleDarkMode}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className="p-2 text-2xl bg-white/10 hover:bg-white/20"
                isDarkMode={isDarkMode}
              />
              <Button text="Login" to="/login" isDarkMode={isDarkMode} className="px-6 py-2  rounded  font-medium text-sm transition" />
              <Button text="Sign Up" to="/signup" isDarkMode={isDarkMode} className="px-6 py-2  rounded  transition font-medium text-sm shadow" />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}

      <div id="home" className="relative min-h-screen  bg-black/80 text-white  overflow-hidden scroll-mt-20">
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="text-center mb-16 -mt-8">
            <h1 className="text-6xl font-bold mb-10 tracking-tight">
              <span
                className={`bg-clip-text text-transparent ${isDarkMode
                  ? "bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400"
                  : "bg-gradient-to-r from-black via-gray-800 to-gray-600"
                  }`}
              >
                Web Server Monitoring
              </span>
              <br />
              <span
                className={`bg-clip-text text-transparent mt-6 ${isDarkMode
                  ? "bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400"
                  : "bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500"
                  }`}
              >
                Made Simple
              </span>
            </h1>

            <p
              className={`text-xl mb-8 max-w-3xl mx-auto leading-relaxed ${isDarkMode ? "text-white" : "text-black"
                }`}
            >
              Monitor, manage, and optimize your web servers with real-time
              metrics, intelligent alerts, and comprehensive performance
              analytics—all from one powerful dashboard.

            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Button text="Start Moitoring Free" to="/signup" isDarkMode={isDarkMode} className="px-8 py-4 rounded transition font-bold shadow text-lg" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full z-0">
          <img
            src={isDarkMode ? heroDark : heroLight}
            alt="Wave decoration"
            className="w-full object-cover opacity-90"
          />
        </div>
      </div>

      <div className="h-8 bg-white/10" />

      <div
        id="features"
        className={`features-section scroll-mt-28 ${isDarkMode ? "features-dark" : "features-light"
          }`}
      >
        <div className="features-content">

          <h2 className="features-title">
            Powerful Features
          </h2>

          <p className="features-subtitle">
            Everything you need to keep your servers running smoothly
          </p>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">

                <div className="feature-icon">
                  {feature.icon}
                </div>

                <h3 className="feature-title">
                  {feature.title}
                </h3>

                <p className="feature-desc">
                  {feature.description}
                </p>

              </div>
            ))}
          </div>

        </div>
      </div>


      <div className="h-6 bg-white/10" />
      {/* Stats Section */}
      <div
        id="stats"
        className={`scroll-mt-28 rounded-2xl p-10 shadow-xl hero-bg ${isDarkMode ? "dark-mode text-white" : "light-mode text-black"
          }`}
      >
        <h2 className="text-4xl font-bold text-center mb-3">
          System Monitoring at Scale
        </h2>

        <p
          className={`text-center mb-10 text-base max-w-2xl mx-auto ${isDarkMode ? "text-slate-200" : "text-black"
            }`}
        >
          Powerful insights and real-time monitoring for all your servers
        </p>

        {/* Large Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          <div
            className={`p-8 rounded-2xl shadow-lg border transition ${isDarkMode
              ? "bg-white/10 border-white/10 hover:bg-white/15"
              : "bg-white/60 backdrop-blur-md border-blue-100 hover:bg-white/70"
              }`}
          >
            <h3 className="text-2xl font-semibold mb-3 text-blue-400">
              Real-Time Performance Insights
            </h3>

            <p
              className={`text-sm leading-relaxed ${isDarkMode ? "text-slate-200" : "text-gray-600"
                }`}
            >
              Track CPU usage, memory consumption, disk activity, and system
              health in real time. Metrics are collected automatically every
              few seconds to help detect performance bottlenecks.
            </p>
          </div>

          <div
            className={`p-8 rounded-2xl shadow-lg border transition ${isDarkMode
              ? "bg-white/10 border-white/10 hover:bg-white/15"
              : "bg-white/60 backdrop-blur-md border-blue-100 hover:bg-white/70"
              }`}
          >
            <h3 className="text-2xl font-semibold mb-3 text-blue-400">
              Intelligent Security Monitoring
            </h3>

            <p
              className={`text-sm leading-relaxed ${isDarkMode ? "text-slate-200" : "text-gray-600"
                }`}
            >
              Protect your infrastructure with automated threat detection.
              Suspicious IP addresses can be automatically blocked while alerts
              notify administrators instantly.
            </p>
          </div>

        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div
            className={`p-6 rounded-2xl shadow-lg border text-center transition ${isDarkMode
              ? "bg-white/10 border-white/10 hover:bg-white/15"
              : "bg-white/60 backdrop-blur-md border-blue-100 hover:bg-white/70"
              }`}
          >
            <div className="text-4xl font-bold text-blue-400 mb-2">24/7</div>

            <p className={`${isDarkMode ? "text-slate-200" : "text-gray-600"} text-sm`}>
              Continuous Server Monitoring
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl shadow-lg border text-center transition ${isDarkMode
              ? "bg-white/10 border-white/10 hover:bg-white/15"
              : "bg-white/60 backdrop-blur-md border-blue-100 hover:bg-white/70"
              }`}
          >
            <div className="text-4xl font-bold text-blue-400 mb-2">30s</div>

            <p className={`${isDarkMode ? "text-slate-200" : "text-gray-600"} text-sm`}>
              Automatic Metrics Refresh
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl shadow-lg border text-center transition ${isDarkMode
              ? "bg-white/10 border-white/10 hover:bg-white/15"
              : "bg-white/60 backdrop-blur-md border-blue-100 hover:bg-white/70"
              }`}
          >
            <div className="text-4xl font-bold text-blue-400 mb-2">∞</div>

            <p className={`${isDarkMode ? "text-slate-200" : "text-gray-600"} text-sm`}>
              Multiple Server Management
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl shadow-lg border text-center transition ${isDarkMode
              ? "bg-white/10 border-white/10 hover:bg-white/15"
              : "bg-white/60 backdrop-blur-md border-blue-100 hover:bg-white/70"
              }`}
          >
            <div className="text-4xl font-bold text-blue-400 mb-2">&lt;1s</div>

            <p className={`${isDarkMode ? "text-slate-200" : "text-gray-600"} text-sm`}>
              Instant Alert Notifications
            </p>
          </div>

        </div>
      </div>
      <>
        <div
          id="how"
          className={`how-section mt-16 scroll-mt-28 ${isDarkMode ? "how-dark" : "how-light"
            }`}
        >
          <div className="how-content">

            <h2 className="how-title">
              How It Works
            </h2>

            <p className="how-subtitle">
              Get started in minutes with our simple setup process
            </p>

            <div className="how-grid">

              <div className="how-card">
                <div className="how-step blue">1</div>
                <h3 className="how-card-title">Sign Up</h3>
                <p className="how-card-desc">
                  Create your free account in seconds
                </p>
              </div>

              <div className="how-card">
                <div className="how-step purple">2</div>
                <h3 className="how-card-title">Add Server</h3>
                <p className="how-card-desc">
                  Register your server with simple details
                </p>
              </div>

              <div className="how-card">
                <div className="how-step pink">3</div>
                <h3 className="how-card-title">Install Agent</h3>
                <p className="how-card-desc">
                  Deploy our lightweight monitoring agent
                </p>
              </div>

              <div className="how-card">
                <div className="how-step blue">4</div>
                <h3 className="how-card-title">Monitor</h3>
                <p className="how-card-desc">
                  Watch real-time metrics on your dashboard
                </p>
              </div>

            </div>

          </div>
        </div>
      </>


      <div className="h-6 bg-white/10" />


      <>
        {/* Final CTA */}
        <div id="cta" className={`cta-section ${isDarkMode ? "cta-dark" : "cta-light"}`}>

          <div className="cta-content">
            <h2 className="cta-title">
              <span>Ready to Get Started?</span>
            </h2>

            <p className="cta-text">
              Join now and start monitoring your servers in minutes
            </p>

            {/* <button
              onClick={() => navigate("/signup")}
              className="cta-btn"
            >
              Create Free Account →
            </button> */}
            <Button
              text="Create Free Account"
              to="/signup" isDarkMode={isDarkMode}
              className="cta-btn px-9 py-3.5 text-lg font-bold   rounded-lg cursor-pointer transition-all duration-300"
            />
          </div>

        </div>
      </>


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
