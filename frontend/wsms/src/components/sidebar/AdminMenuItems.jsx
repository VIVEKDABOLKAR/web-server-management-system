import {
  DashboardIcon,
  ServersIcon,
  UserIcon,
  SettingsIcon,
  FormIcon,
} from "./SidebarIcons";

/** Admin Sidebar menu config */
const AdminMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardIcon className="w-5 h-5" />,
    badge: null,
  },
  {
    id: "user-management",
    label: "User Management",
    path: "/admin/users",
    icon: <UserIcon className="w-5 h-5" />,
    badge: null,
  },
  {
    id: "server-management",
    label: "Server Management",
    path: "/admin/servers",
    icon: <ServersIcon className="w-5 h-5" />,
    badge: null,
  },
  {
    id: "form-management",
    label: "Form Management",
    path: "/admin/form",
    icon: <FormIcon className="w-5 h-5" />,
    badge: null,
  },
  {
    id: "settings",
    label: "Settings",
    path: "#",
    icon: <SettingsIcon className="w-5 h-5" />,
    badge: null,
    submenu: [
      { label: "Profile", path: "/profile" },
       { label: "Configuration", path: "/admin/config" },
    ],
  },
];

export default AdminMenuItems;
