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
import Moon from "../../components/svg/Moon";
import Sun from "../../components/svg/Sun";
import Logo from "../../components/ui/Logo";

const Landing = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  useEffect(() => {
    document.title = "Web Server Management System";
  }, []);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
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
    <div className="min-h-screen bg-linear-to-r from-blue-300 via-cyan-200 to-indigo-300 dark:bg-linear-to-r dark:from-black/80 dark:via-gray-800 dark:to-gray-600 transition-colors">
      {/* Navigation */}
      <nav className="sticky top-0 left-0 w-full z-50 border-b border-white/20 bg-white/10 dark:bg-slate-900/30 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Logo />
              <span className="text-xl font-bold dark:text-white tracking-wide">
                WSMS
              </span>
            </div>

            {/* Section Links */}
            <div className="hidden md:flex items-center gap-7 text-black dark:text-white text-sm font-medium tracking-wide ml-8">
              <NavLinkButton label="Home" section="home" scrollToSection={scrollToSection} />
              <NavLinkButton label="Features" section="features" scrollToSection={scrollToSection} />
              <NavLinkButton label="Stats" section="stats" scrollToSection={scrollToSection} />
              <NavLinkButton label="How It Works" section="how" scrollToSection={scrollToSection} />
              <NavLinkButton label="Get Started" section="cta" scrollToSection={scrollToSection} />
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                text={isDarkMode ? <Sun /> : <Moon />}
                onClick={toggleDarkMode}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className="p-2 rounded-md hover:bg-white/20 dark:hover:bg-slate-700/40 transition"
                isDarkMode={isDarkMode}
              />
              <Button text="Login" to="/login" isDarkMode={isDarkMode} className="px-4 py-2 rounded-md font-medium text-xs transition" />
              <Button text="Sign Up" to="/signup" isDarkMode={isDarkMode} className="px-4 py-2 rounded-md transition font-medium text-xs shadow" />
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/20 dark:hover:bg-slate-700/40 transition"
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="rounded-xl border border-white/20 bg-black/35 dark:bg-slate-900/45 backdrop-blur-xl p-3 space-y-2 text-sm text-white shadow-lg">
                <button type="button" onClick={() => scrollToSection("home")} className="w-full text-left rounded-md px-3 py-2 hover:bg-white/15 transition">Home</button>
                <button type="button" onClick={() => scrollToSection("features")} className="w-full text-left rounded-md px-3 py-2 hover:bg-white/15 transition">Features</button>
                <button type="button" onClick={() => scrollToSection("stats")} className="w-full text-left rounded-md px-3 py-2 hover:bg-white/15 transition">Stats</button>
                <button type="button" onClick={() => scrollToSection("how")} className="w-full text-left rounded-md px-3 py-2 hover:bg-white/15 transition">How It Works</button>
                <button type="button" onClick={() => scrollToSection("cta")} className="w-full text-left rounded-md px-3 py-2 hover:bg-white/15 transition">Get Started</button>
                <div className="pt-2 border-t border-white/20 flex items-center gap-2">
                  <Button
                    text={isDarkMode ? <Sun /> : <Moon />}
                    onClick={toggleDarkMode}
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    className="p-2 rounded-md hover:bg-white/20 dark:hover:bg-slate-700/40 transition"
                    isDarkMode={isDarkMode}
                  />
                  <Button text="Login" to="/login" isDarkMode={isDarkMode} className="px-4 py-2 rounded-md font-medium text-xs transition" />
                  <Button text="Sign Up" to="/signup" isDarkMode={isDarkMode} className="px-4 py-2 rounded-md transition font-medium text-xs shadow" />
                </div>
              </div>
            </div>
          )}
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
                  ? "bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-400"
                  : "bg-linear-to-r from-black/80 via-gray-800 to-gray-600"
                  }`}
              >
                Web Server Managment System
              </span>
              <br />
              <span
                className={`bg-clip-text text-transparent mt-6 text-5xl ${isDarkMode
                  ? "bg-linear-to-r from-purple-400 via-blue-400 to-cyan-400"
                  : "bg-linear-to-r from-gray-900 via-gray-700 to-gray-500"
                  }`}
              >
                Made Simple
              </span>
            </h1>

            <p
              className={`text-xl mb-8 max-w-3xl mx-auto leading-relaxed ${isDarkMode ? "text-white" : "text-black"
                }`}
            >
              Manage, monitor, and optimize your web servers with real-time
              metrics, intelligent alerts, and complete server operations
              controls from one powerful dashboard.

            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Button text="Start Managing Free" to="/signup" isDarkMode={isDarkMode} className="px-8 py-4 rounded transition font-bold shadow text-lg" />
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

      <div className="h-1 bg-white/5" />

      <div
        id="features"
        className={`features-section scroll-mt-1 ${isDarkMode ? "features-dark" : "features-light"
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


      <div className="h-1 bg-white/5" />
      {/* Stats Section */}
      <div
        id="stats"
        className={`scroll-mt-10 rounded-2xl p-10 shadow-xl hero-bg ${isDarkMode ? "dark-mode text-white" : "light-mode text-black"
          }`}
      >
        <h2 className="text-4xl font-bold text-center mb-3">
          Server Management at Scale
        </h2>

        <p
          className={`text-center mb-10 text-base max-w-2xl mx-auto ${isDarkMode ? "text-slate-200" : "text-black"
            }`}
        >
          Powerful insights, real-time observability, and active management for all your servers
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
          className={`how-section mt-1 scroll-mt-5 ${isDarkMode ? "how-dark" : "how-light"
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
                <h3 className="how-card-title">Manage & Monitor</h3>
                <p className="how-card-desc">
                  Manage server operations with live health and performance data
                </p>
              </div>

            </div>

          </div>
        </div>
      </>


      <div className="h-1 bg-white/5" />

      <>
        {/* Final CTA */}
        <div id="cta" className={`cta-section mt-16 scroll-mt-20 ${isDarkMode ? "cta-dark" : "cta-light"}`}>

          <div className="cta-content">
            <h2 className="cta-title">
              <span>Ready to Get Started?</span>
            </h2>

            <p className="cta-text">
              Join now and start managing your servers in minutes
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
      <footer className="mt-16 border-t border-white/25 bg-white/35 dark:bg-slate-900/45 backdrop-blur-xl transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-md flex items-center justify-center shadow">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">WSMS</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Web Server Management System</p>
              </div>
            </div>

            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Unified platform for server management, monitoring, security actions,
              and operational visibility in one dashboard.
            </div>

            <div className="md:text-right text-sm text-slate-600 dark:text-slate-400">
              <p>Built for modern infrastructure teams.</p>
              <p className="mt-2">© 2026 Web Server Management System</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
