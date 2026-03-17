import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import WebTerminal from "../components/terminal/WebTerminal";
import api from "../services/api";

const ServerSetup = () => {
  const { serverId } = useParams();
  const { state } = useLocation();

  const serverName = state?.serverName || `Server #${serverId}`;
  const ipAddress = state?.ipAddress || "YOUR_AWS_PUBLIC_IP";
  const osType = state?.osType || "LINUX";
  const webServerType = state?.webServerType || "APACHE";
  const webServerPortNo = state?.webServerPortNo || "80";
  const terminalControlRef = useRef(null);
  const [sshUser, setSshUser] = useState("ubuntu");
  const [keyPath, setKeyPath] = useState(
    "D:\\project\\web-server-management-system\\keys\\key.pem",
  );
  const [backendUrl, setBackendUrl] = useState("http://localhost:8080");
  const [actionMessage, setActionMessage] = useState("");
  const [agentToken, setAgentToken] = useState(state?.agentToken || "");
  const [tokenCopied, setTokenCopied] = useState(false);

  // Fetch server details (incl. agentToken) if not passed in route state
  useEffect(() => {
    if (agentToken) return;
    api
      .get(`/api/servers/${serverId}`)
      .then((res) => setAgentToken(res.data.agentToken || ""))
      .catch(() => {});
  }, [serverId, agentToken]);

  const sshCommand = `ssh -i "${keyPath}" ${sshUser}@${ipAddress}`;
  const downloadInstallerCommand = `curl -fsSL ${backendUrl}/api/agent/install.sh -o install.sh`;
  const installCommand = `sudo ./install.sh ${serverId} "${agentToken}" "${backendUrl}"`;

  const commands = useMemo(
    () =>
`# 1) SSH into AWS EC2 instance (use your WSMS keypair)
${sshCommand}

# 2) Update packages
sudo apt update && sudo apt upgrade -y

# 3) Confirm AWS Security Group inbound rules:
#    - Port 22   (SSH from your IP)
#    - Port ${webServerPortNo} (${webServerType} web traffic)

# 4) Download setup script from WSMS backend
${downloadInstallerCommand}

# 5) Make script executable
chmod +x install.sh

# 6) Run setup — binds agent to this server using your token
${installCommand}

# 7) Verify agent service
sudo systemctl status wsms-agent --no-pager
`,
    [downloadInstallerCommand, installCommand, sshCommand, webServerPortNo, webServerType],
  );

  const copyCommands = () => {
    navigator.clipboard.writeText(commands);
  };

  const runStepCommand = (cmd, description) => {
    const sent = terminalControlRef.current?.sendCommand(cmd);
    setActionMessage(
      sent
        ? `${description} command sent to terminal.`
        : "Terminal is not connected. Click Retry and try again.",
    );
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Server Setup: {serverName}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Follow these steps to connect to your AWS server and install the WSMS monitoring agent.
          </p>

          {/* ── Prerequisites banner ─────────────────────────────────────── */}
          <section className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
            <h2 className="text-base font-semibold text-amber-900 dark:text-amber-100 mb-2">
              Before You Start — Checklist
            </h2>
            <ol className="list-decimal pl-5 space-y-1 text-sm text-amber-900/90 dark:text-amber-100/90">
              <li>AWS Security Group: allow inbound <strong>port 22 (SSH)</strong> from your public IP.</li>
              <li>AWS Security Group: allow inbound <strong>port {webServerPortNo}</strong> ({webServerType} traffic).</li>
              <li>Key file is at the path you set below and has correct permissions.</li>
              <li>WSMS backend is accessible from EC2 (update Backend URL below if needed).</li>
            </ol>
          </section>

          {/* ── Agent token + server info ─────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Server Info
              </h2>
              <div className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                <div className="flex justify-between rounded-md bg-slate-50 dark:bg-slate-700/50 px-3 py-2">
                  <span className="font-medium">Target IP</span>
                  <span className="font-mono">{ipAddress}</span>
                </div>
                <div className="flex justify-between rounded-md bg-slate-50 dark:bg-slate-700/50 px-3 py-2">
                  <span className="font-medium">OS</span>
                  <span className="font-mono">{osType}</span>
                </div>
                <div className="flex justify-between rounded-md bg-slate-50 dark:bg-slate-700/50 px-3 py-2">
                  <span className="font-medium">Server ID</span>
                  <span className="font-mono">{serverId}</span>
                </div>
                <div className="flex justify-between rounded-md bg-slate-50 dark:bg-slate-700/50 px-3 py-2">
                  <span className="font-medium">Web Port</span>
                  <span className="font-mono">{webServerPortNo}</span>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Agent Token
                </p>
                <div className="flex gap-2 items-center">
                  <code className="flex-1 block rounded-md bg-slate-100 dark:bg-slate-700 px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-100 break-all">
                    {agentToken || "Loading…"}
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(agentToken);
                      setTokenCopied(true);
                      setTimeout(() => setTokenCopied(false), 2000);
                    }}
                    className="px-3 py-2 text-xs bg-slate-200 dark:bg-slate-600 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500"
                  >
                    {tokenCopied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </section>

            <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Full Setup Commands
                </h2>
                <button
                  onClick={copyCommands}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
                >
                  Copy All
                </button>
              </div>
              <div className="rounded-lg bg-black text-green-400 p-4 font-mono text-xs overflow-x-auto max-h-72">
                <pre>{commands}</pre>
              </div>
            </section>
          </div>

          {/* ── Local Windows deploy shortcut ─────────────────────────────── */}
          <section className="mb-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
              One-Command Local Deploy (PowerShell)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Run this from D:\project\web-server-management-system\backend\wsms on your local machine.
              It uses the backend folder as the entrypoint, builds the agent, copies it to EC2, and installs it automatically.
            </p>
            <div className="rounded-lg bg-black text-cyan-300 p-4 font-mono text-xs overflow-x-auto">
              <pre>{`.\deploy-agent.ps1 \`
  -ServerId ${serverId} \`
  -AgentToken "${agentToken || "<your-token>"}" \`
  -BackendUrl "${backendUrl}" \`
  -SshHost ${ipAddress} \`
  -SshUser ${sshUser} \`
  -KeyFile "${keyPath}"`}</pre>
            </div>
          </section>

          {/* ── Real-time terminal ──────────────────────────────────────────── */}
          <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Real-Time Terminal
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Configure SSH details below, then click step buttons to send each command directly to the Spring Boot backend terminal.
            </p>

            {/* Config inputs */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                value={sshUser}
                onChange={(e) => setSshUser(e.target.value)}
                placeholder="SSH user (ubuntu)"
                className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
              />
              <input
                type="text"
                value={keyPath}
                onChange={(e) => setKeyPath(e.target.value)}
                placeholder="Local key.pem path"
                className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm md:col-span-2"
              />
              <input
                type="text"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                placeholder="Backend URL"
                className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
              />
            </div>

            {/* Step buttons */}
            <div className="mb-4 flex flex-wrap gap-2">
              <button type="button"
                onClick={() => runStepCommand(sshCommand, "SSH connect")}
                className="px-3 py-1.5 bg-slate-800 text-white text-sm rounded-md hover:bg-slate-900 transition">
                1. SSH Connect
              </button>
              <button type="button"
                onClick={() => runStepCommand("sudo apt update && sudo apt upgrade -y", "Update packages")}
                className="px-3 py-1.5 bg-slate-700 text-white text-sm rounded-md hover:bg-slate-800 transition">
                2. Update Packages
              </button>
              <button type="button"
                onClick={() => runStepCommand(downloadInstallerCommand, "Download installer")}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition">
                3. Download Installer
              </button>
              <button type="button"
                onClick={() => runStepCommand("chmod +x install.sh", "chmod")}
                className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition">
                4. chmod
              </button>
              <button type="button"
                onClick={() => runStepCommand(installCommand, "Install agent")}
                className="px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 transition">
                5. Install Agent
              </button>
              <button type="button"
                onClick={() => runStepCommand("sudo systemctl status wsms-agent --no-pager", "Check service")}
                className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition">
                6. Verify Service
              </button>
              <button type="button"
                onClick={() => runStepCommand("tail -f /opt/wsms-agent/agent.log", "Tail logs")}
                className="px-3 py-1.5 bg-rose-600 text-white text-sm rounded-md hover:bg-rose-700 transition">
                7. Tail Logs
              </button>
            </div>

            {actionMessage && (
              <p className="mb-3 text-sm text-slate-700 dark:text-slate-300">{actionMessage}</p>
            )}

            <WebTerminal ref={terminalControlRef} serverId={serverId} />
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ServerSetup;