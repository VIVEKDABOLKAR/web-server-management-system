const AddServerForm = ({
  formData,
  osTypes,
  webServerTypes,
  loading,
  error,
  success,
  onChange,
  onSelectOs,
  onSelectWebServer,
  onSubmit,
  onCancel,
  disabledSubmit,
  spacious = false,
}) => {
  const cardPadding = spacious ? "p-8" : "p-6";
  const titleClass = spacious ? "text-2xl mb-8" : "text-xl mb-6";
  const formSpacing = spacious ? "space-y-8" : "space-y-5";
  const labelSpacing = spacious ? "mb-2" : "mb-1";
  const fieldPadding = spacious ? "px-4 py-3" : "px-3 py-2";
  const textareaRows = spacious ? 4 : 3;
  const actionsPadding = spacious ? "pt-6" : "pt-2";
  const actionsGap = spacious ? "gap-4" : "gap-3";
  const buttonPadding = spacious ? "px-6 py-3 text-lg" : "px-5 py-2";
  const messagePadding = spacious ? "p-4 mb-6" : "p-3 mb-4";

  return (
    <div className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm ${cardPadding}`}>
   

      {error && (
        <div className={`${messagePadding} text-sm text-red-600 bg-red-50 border border-red-200 rounded`}>
          {error}
        </div>
      )}

      {success && (
        <div className={`${messagePadding} text-sm text-green-600 bg-green-50 border border-green-200 rounded`}>
          {success}
        </div>
      )}

      <form onSubmit={onSubmit} className={formSpacing}>
        <div>
          <label className={`block text-sm font-medium text-slate-700 dark:text-slate-300 ${labelSpacing}`}>
            Server Name
          </label>
          <input
            type="text"
            name="serverName"
            value={formData.serverName}
            onChange={onChange}
            placeholder="Production Web Server"
            className={`w-full ${fieldPadding} border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium text-slate-700 dark:text-slate-300 ${labelSpacing}`}>
            IP Address
          </label>
          <input
            type="text"
            name="ipAddress"
            value={formData.ipAddress}
            onChange={onChange}
            placeholder="192.168.1.100"
            className={`w-full ${fieldPadding} border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium text-slate-700 dark:text-slate-300 ${labelSpacing}`}>
            Operating System
          </label>
          <select
            name="osType"
            onChange={onSelectOs}
            value={formData.osType?.id || ""}
            className={`w-full ${fieldPadding} border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500`}
          >
            {osTypes.map((os) => (
              os.active && (
              <option key={os.id} value={os.id}>
                {os.name}
              </option>)
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium text-slate-700 dark:text-slate-300 ${labelSpacing}`}>
            Web Server Type
          </label>
          <select
            name="webServerType"
            onChange={onSelectWebServer}
            value={formData.webServerType?.id || ""}
            className={`w-full ${fieldPadding} border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500`}
          >
            {webServerTypes.map((web) => (
              web.active &&
              <option key={web.id} value={web.id}>
                {web.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium text-slate-700 dark:text-slate-300 ${labelSpacing}`}>
            Web Server Port
          </label>
          <input
            type="number"
            name="webServerPortNo"
            value={formData.webServerPortNo}
            onChange={onChange}
            placeholder="e.g., 80, 443"
            className={`w-full ${fieldPadding} border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100`}
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium text-slate-700 dark:text-slate-300 ${labelSpacing}`}>
            Description
          </label>
          <textarea
            name="description"
            rows={textareaRows}
            value={formData.description}
            onChange={onChange}
            className={`w-full ${fieldPadding} border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        <div className={`flex ${actionsGap} ${actionsPadding}`}>
          <button
            type="submit"
            disabled={loading || disabledSubmit}
            className={`flex-1 ${buttonPadding} bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium`}
          >
            {loading ? "Adding..." : "Add Server"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className={`flex-1 ${buttonPadding} bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition font-medium`}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddServerForm;
