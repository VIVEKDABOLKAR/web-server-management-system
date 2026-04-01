/** Sidebar top header */
const SidebarHeader = ({ toggleOpen }) => {
  return (
    <div className="sticky top-0 flex flex-row items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 rounded-tr-2xl z-10 shadow">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow">
          W
        </div>
      </div>
      <button
        onClick={() => toggleOpen()}
        className="w-8 h-8 flex items-center justify-center text-xl text-slate-500 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
        title="Close sidebar"
        style={{ lineHeight: 1 }}
      >
        ✕
      </button>
    </div>
  );
};

export default SidebarHeader;
