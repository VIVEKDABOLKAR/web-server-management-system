/** Sidebar top header */
const SidebarHeader = ({ toggleOpen }) => {
  return (
    <div className="sticky top-0 flex justify-between p-3 
                        bg-gradient-to-b from-slate-500 to-slate-500 dark:from-slate-900 dark:to-slate-900
                        shadow-sm bg-fixed
                         border-b border-slate-400/20 ">
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