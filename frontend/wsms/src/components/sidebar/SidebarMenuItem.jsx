import { Link, useLocation } from "react-router-dom";

/** Single menu item */
const SidebarMenuItem = ({
  item,
  expandedMenu,
  toggleSubmenu,
  isActive,
  handleLinkClick,
}) => {
  const location = useLocation();
  // For submenu highlighting, match full path + search
  const isSubActive = (subPath) => {
    return location.pathname + location.search === subPath;
  };
  return (
    <div>
      <button
        onClick={() =>
          item.submenu ? toggleSubmenu(item.id) : handleLinkClick()
        }
        className={`
          w-full flex items-center justify-between px-4 py-3 rounded-lg
          transition-all duration-200 font-medium text-sm
          ${
            // Highlight parent only if its path matches exactly and it has no submenu
            item.path !== "#" &&
            location.pathname === item.path &&
            !item.submenu
              ? "bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
          }
        `}
      >
        <Link
          to={item.path !== "#" ? item.path : "#"}
          onClick={(e) => item.path === "#" && e.preventDefault()}
          className="flex items-center gap-3 flex-1 text-left"
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>

        {item.submenu && (
          <span
            className={`transform transition-transform ${
              expandedMenu === item.id ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        )}
      </button>

      {item.submenu && expandedMenu === item.id && (
        <div className="mt-2 ml-4 space-y-1 border-l-2 border-slate-300 dark:border-slate-600 pl-3">
          {item.submenu.map((subitem, i) => (
            <Link
              key={i}
              to={subitem.path}
              // Highlight submenu if full path+search matches
              className={`
                block px-4 py-2 rounded-lg text-sm
                ${
                  isSubActive(subitem.path)
                    ? "bg-sky-100 dark:bg-sky-900 text-sky-700"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }
              `}
            >
              {subitem.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarMenuItem;
