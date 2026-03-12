/** Sidebar top header */
const SidebarHeader = ({ toggleOpen }) => {
  return (
    <div className="sticky top-0 flex justify-between p-3 shadow-sm">
      <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
        W
      </div>

      <button
        onClick={() => toggleOpen()}
        className="text-xl text-slate-700 dark:text-white cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
};

export default SidebarHeader;