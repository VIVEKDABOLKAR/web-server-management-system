const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  serverName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded shadow max-w-md w-full mx-4 overflow-hidden border border-gray-300 dark:border-slate-700 animate-slideUp">
        {/* Header */}
        <div className="bg-gray-100 dark:bg-slate-700 px-6 py-4 border-b border-gray-300 dark:border-slate-600">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </h3>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 dark:text-gray-300 mb-3">{message}</p>
          {serverName && (
            <div className="bg-gray-50 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-md p-3 mt-3">
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {serverName}
              </p>
            </div>
          )}
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">
            This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 dark:bg-slate-700/30 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 hover:bg-gray-100 dark:hover:bg-slate-500 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-md text-white bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 transition font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
