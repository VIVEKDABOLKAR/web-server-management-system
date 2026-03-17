import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import WebTerminal from "../components/terminal/WebTerminal";
import api from "../services/api";

const ServerSetup = () => {
  const { serverId } = useParams();
  const { state } = useLocation();

  const [scriptUrl, setScriptUrl] = useState(null);
  const [server, setServer] = useState(null);

  const serverName = state?.serverName || `Server #${serverId}`;
  const ipAddress = state?.ipAddress || "YOUR_AWS_PUBLIC_IP";
  const terminalControlRef = useRef(null);

    useEffect(() => {
    const fetchScriptUrl = async () => {
      try {
        const res = await api.get(`/api/servers/${serverId}/install-script`);        
        setScriptUrl(res.data);
      } catch (err) {
        showToast("Failed to load install script", "error");
      } finally {
        setLoading(false);
      }
    };

    const fetchServerDetails = async () => {
    try {
      const response = await api.get(`/api/servers/${serverId}`);
      console.log(response.data);
      
      setServer(response.data);
    } catch (err) {
      setError("Failed to fetch server details");
    }
  };
    
    fetchScriptUrl();
    fetchServerDetails();
  }, [serverId]);

  const instructions = [
    {
      title: "SSH into your server",
      description: "Connect to your server using SSH",
      command: `ssh username@${server.ipAddress}`,
    },
    {
      title: "Download install script",
      description: "Fetch the installer from the server",
      command:
        `curl -fL ${scriptUrl} -o ./install-script.sh`,
    },
    {
      title: "Make script executable",
      description: "Add execute permission to the script",
      command: "chmod +x install-script.sh",
    },
    {
      title: "Run the installer",
      description: "Execute the script to install and start the agent service",
      command: "./install-script.sh",
    },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6 ml-12">
            Setup: {serverName}
          </h1>

          {/* Installation Steps */}
          <div className="space-y-4 mb-8 ml-12">
            {instructions.map((step, index) => (
              <div
                key={step.title}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      {step.title}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      {step.description}
                    </p>
                    <code className="block bg-black text-green-400 p-3 rounded font-mono text-sm mb-3 overflow-x-auto">
                      {step.command}
                    </code>
                  </div>
                </div>
              </div>
            ))}

            {/* Summary */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-lg p-4">
              <p className="text-sm text-emerald-900 dark:text-emerald-100">
                ✓ After the script completes, your agent service will run automatically.
                <br />
                ✓ Your server will start sending monitoring data to the dashboard.
              </p>
            </div>
          </div>

          {/* Real-time Terminal */}
          <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Live Terminal
            </h2>
            <WebTerminal ref={terminalControlRef} serverId={serverId} />
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ServerSetup;