import { useEffect, useRef, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import WebTerminal from "../../../components/terminal/WebTerminal";
import api from "../../../services/api";

const defaultSetupUiConfig = {
  showTerminalOnServerSetup: false,
  serverAgentJarUrl: "",
};

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? "Copied!" : "Copy to clipboard"}
      className="shrink-0 p-1.5 rounded transition text-slate-400 hover:text-white hover:bg-slate-600"
    >
      {copied ? (
        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
};

const ServerSetup = () => {
  const { serverId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [scriptUrl, setScriptUrl] = useState(null);
  const [server, setServer] = useState({ ipAddress: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uiConfig, setUiConfig] = useState(defaultSetupUiConfig);

  const serverName = state?.serverName || `Server #${serverId}`;
  const terminalControlRef = useRef(null);

  useEffect(() => {
    let active = true;

    const loadUiConfig = async () => {
      try {
        const configRes = await api.get("/api/users/config");
        console.log(configRes);
        
        if (!active) return;

        setUiConfig({
          ...defaultSetupUiConfig,
          ...(configRes?.data || {}),
        });
      } catch {
        if (!active) return;
        setUiConfig(defaultSetupUiConfig);
      }
    };

    const fetchAll = async () => {
      try {
        const [scriptRes, serverRes] = await Promise.all([
          api.get(`/api/servers/${serverId}/install-script`),
          api.get(`/api/servers/${serverId}`),
        ]);

        await loadUiConfig();

        if (!active) return;
        setScriptUrl(scriptRes.data);
        setServer(serverRes.data);
      } catch (err) {
        if (!active) return;
        setError("Failed to load setup details. Please try again.");
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchAll();
    return () => { active = false; };
  }, [serverId]);

  if (loading) {
    return (
      <div className="min-h-full bg-linear-to-br from-slate-100 via-cyan-50 to-blue-100 px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white/85 p-8 text-center shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/75">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mx-auto mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading setup details...</p>
        </div>
      </div>
    );
  }

  const instructions = [
    {
      step: 1,
      title: "SSH into your server",
      description: "Open a terminal and connect to your server via SSH.",
      command: `ssh username@${server.ipAddress}`,
      warning: null,
    },
    {
      step: 2,
      title: "Download the install script",
      description: "Fetch the installer generated for this server from S3.",
      command: `curl -fL "${scriptUrl}" -o ./install-script.sh`,
      warning: null,
    },
    {
      step: 3,
      title: "Make the script executable",
      description: "Grant execute permission before running.",
      command: "chmod +x install-script.sh",
      warning: null,
    },
    {
      step: 4,
      title: "Run the installer",
      description: "This installs and starts the WSMS agent as a background service.",
      command: "./install-script.sh",
      warning: null,
    },
    {
      step: 5,
      title: "Fix line-ending errors (if needed)",
      description: 'If you see "cannot execute: required file not found", the script has Windows-style line endings. Run this then re-run step 4.',
      command: "sed -i 's/\\r$//' install-script.sh || dos2unix install-script.sh",
      warning: "Only needed if the installer fails with a line-ending error.",
    },
  ];

  return (
    <div className="min-h-full bg-linear-to-br from-slate-100 via-cyan-50 to-blue-100 px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950">
      <div className="max-w-4xl mx-auto">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Go back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Agent Setup</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {serverName}
            {server.ipAddress && (
              <span className="ml-2 font-mono text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                {server.ipAddress}
              </span>
            )}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3">
          <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Installation steps */}
      <section className="mb-8">
        <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-4">
          Installation Steps
        </h2>
        <div className="space-y-3">
          {instructions.map((step) => (
            <div
              key={step.step}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {step.step}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{step.description}</p>
                  <div className="flex items-center gap-2 bg-slate-900 dark:bg-slate-950 rounded-lg px-4 py-3 font-mono text-sm text-green-400 overflow-x-auto">
                    <span className="select-all flex-1 whitespace-pre break-all">{step.command}</span>
                    <CopyButton text={step.command} />
                  </div>
                  {step.warning && (
                    <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                      {step.warning}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 px-4 py-3">
          <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-emerald-800 dark:text-emerald-200">
            <p className="font-medium mb-0.5">After setup completes</p>
            <p className="text-emerald-700 dark:text-emerald-300">The agent service will start automatically and your server will begin sending monitoring data to the dashboard within seconds.</p>
          </div>
        </div>

        {uiConfig.serverAgentJarUrl && (
          <div className="mt-4 flex items-start gap-3 rounded-xl bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-700 px-4 py-3">
            <svg className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-8m0 8l-3-3m3 3l3-3M5 20h14" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sky-800 dark:text-sky-200 mb-1">Agent JAR URL (from Admin Config)</p>
              <p className="text-xs text-sky-700 dark:text-sky-300 mb-2">You can directly download the configured server-agent jar with:</p>
              <div className="flex items-center gap-2 bg-slate-900 dark:bg-slate-950 rounded-lg px-4 py-3 font-mono text-sm text-green-400 overflow-x-auto">
                <span className="select-all flex-1 whitespace-pre break-all">{`curl -fL "${uiConfig.serverAgentJarUrl}" -o ./wsms-server-agent.jar`}</span>
                <CopyButton text={`curl -fL "${uiConfig.serverAgentJarUrl}" -o ./wsms-server-agent.jar`} />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Terminal section (config-driven visibility) */}
      {uiConfig.showTerminalOnServerSetup ? (
        <section className="bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden backdrop-blur">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Live Terminal</h2>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Restricted shell — only setup-related commands are allowed
            </p>
          </div>
          <div className="p-5">
            <WebTerminal ref={terminalControlRef} serverId={serverId} />
          </div>
        </section>
      ) : (
        <section className="bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden backdrop-blur p-5">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Live Terminal is hidden by admin configuration.
          </p>
        </section>
      )}
      </div>
    </div>
  );
};

export default ServerSetup;