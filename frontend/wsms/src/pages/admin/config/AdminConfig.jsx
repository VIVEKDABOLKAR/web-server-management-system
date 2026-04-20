import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import SectionCard from "../../../components/SectionCard";
import api from "../../../services/api";
import { toast } from "react-toastify";

const defaultConfig = {
  allowWebClientRequests: true,
  emailServiceEnabled: true,
  serverAgentJarUrl: "",
  showTerminalOnServerSetup: true,
};

const ToggleField = ({ id, title, description, checked, onChange }) => (
  <div className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/50 p-4">
    
    <div>
      <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100">
        {title}
      </label>
      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
        {description}
      </p>
    </div>

    <label htmlFor={id} className="inline-flex items-center cursor-pointer group">
      <input
        id={id}
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />

      {/* Track */}
      <span className="w-11 h-6 bg-slate-300 dark:bg-slate-600 rounded-full relative transition-colors duration-300 ease-in-out group-has-[:checked]:bg-sky-600">
        
        {/* Knob */}
        <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transform transition-all duration-300 ease-in-out group-has-[:checked]:translate-x-5" />
      
      </span>
    </label>
  </div>
);

const AdminConfig = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState(defaultConfig);
  const [initialConfig, setInitialConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleOpenSwaggerUi = () => {
    navigate("/admin/swagger");
  };

  useEffect(() => {
    const loadConfig = async () => {
      setLoading(true);
      try {
        const response = await api.get("/api/admin/config");
        const merged = {
          ...defaultConfig,
          ...(response?.data || {}),
        };
        setConfig(merged);
        setInitialConfig(merged);
      } catch {
        setConfig(defaultConfig);
        setInitialConfig(defaultConfig);
        toast.error("Failed to load config. Using default values.");
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const hasUnsavedChanges = useMemo(() => JSON.stringify(config) !== JSON.stringify(initialConfig), [config, initialConfig]);

  const updateConfig = (key, value) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setConfig(initialConfig);
    toast.info("Changes reverted.");
  };

  const handleSave = async () => {
    const normalized = {
      ...config,
      serverAgentJarUrl: config.serverAgentJarUrl?.trim() || "",
    };

    setSaving(true);
    try {
      await api.put("/api/admin/config", normalized);
      setConfig(normalized);
      setInitialConfig(normalized);
      toast.success("Configuration updated successfully.");
    } catch {
      toast.error("Failed to save configuration.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout pageTitle="Admin Configuration">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Configuration</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Manage core platform controls and server setup behavior.
            </p>
          </div>

          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${hasUnsavedChanges ? "bg-amber-100 text-amber-700 border border-amber-300" : "bg-emerald-100 text-emerald-700 border border-emerald-300"}`}>
            {hasUnsavedChanges ? "Unsaved changes" : "All changes saved"}
          </span>
        </div>

        {loading ? (
          <div className="rounded-lg px-4 py-8 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            Loading configuration...
          </div>
        ) : (
          <>
            <SectionCard title="Request and Service Controls">
              <div className="space-y-3">
                <ToggleField
                  id="allowWebClientRequests"
                  title="Allow Web Client Requests"
                  description="Enable or disable requests coming from the web client."
                  checked={config.allowWebClientRequests}
                  onChange={(value) => updateConfig("allowWebClientRequests", value)}
                />

                <ToggleField
                  id="emailServiceEnabled"
                  title="Enable Email Service"
                  description="Turn email delivery on or off globally."
                  checked={config.emailServiceEnabled}
                  onChange={(value) => updateConfig("emailServiceEnabled", value)}
                />
              </div>
            </SectionCard>

            <SectionCard title="Server Agent Configuration">
              <div className="space-y-4">
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/50 p-4">
                  <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
                    Server-Agent JAR URL
                  </label>
                  <input
                    type="url"
                    value={config.serverAgentJarUrl}
                    onChange={(e) => updateConfig("serverAgentJarUrl", e.target.value)}
                    placeholder="https://your-cdn.com/wsms/server-agent.jar"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    This URL is shown on the server setup page as the direct agent download command.
                  </p>
                </div>

                <ToggleField
                  id="showTerminalOnServerSetup"
                  title="Show Terminal on Server Setup"
                  description="Dynamically show or hide the Live Terminal section on the server setup page."
                  checked={config.showTerminalOnServerSetup}
                  onChange={(value) => updateConfig("showTerminalOnServerSetup", value)}
                />
              </div>
            </SectionCard>

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={handleOpenSwaggerUi}
                className="px-5 py-2.5 rounded-lg border border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-200 bg-sky-50 dark:bg-sky-900/30 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition font-medium"
              >
                Open Swagger UI
              </button>

              <button
                onClick={handleReset}
                disabled={saving || !hasUnsavedChanges}
                className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset
              </button>

              <button
                onClick={handleSave}
                disabled={saving || !hasUnsavedChanges}
                className="px-5 py-2.5 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Configuration"}
              </button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminConfig;
