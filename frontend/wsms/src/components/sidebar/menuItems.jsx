import {
  DashboardIcon,
  MonitoringIcon,
  SecurityIcon,
  ServersIcon,
  SettingsIcon,
} from "./SidebarIcons";

/** Sidebar menu config */
const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon className="w-5 h-5" />,
    badge: null,
  },
  {
    id: "servers",
    label: "Servers",
    path: "#",
    icon: <ServersIcon className="w-5 h-5" />,
    submenu: [
      { label: "All Servers", path: "/all-servers" },
      { label: "Add Server", path: "/add-server" },
      { label: "Active Servers", path: "/all-servers?status=active" },
      { label: "Inactive Servers", path: "/all-servers?status=inactive" },
    ],
  },
  {
    id: "monitoring",
    label: "Monitoring",
    path: "#",
    icon: <MonitoringIcon className="w-5 h-5" />,
    submenu: [
      { label: "Performance", path: "/performance" },
      { label: "Alerts", path: "#" },
      { label: "Logs", path: "#" },
    ],
    badge: "3",
  },
  {
    id: "security",
    label: "Security",
    path: "#",
    icon: <SecurityIcon className="w-5 h-5" />,
    submenu: [
      { label: "Blocked IPs", path: "#" },
      { label: "Access Control", path: "#" },
      { label: "Firewall Rules", path: "#" },
    ],
  },
  {
    id: "admin",
    label: "Admin",
    path: "#",
    icon: <SettingsIcon className="w-5 h-5" />,
    adminOnly: true,
    submenu: [
      { label: "Admin Dashboard", path: "/admin/dashboard" },
      { label: "Admin Add Server", path: "/admin/add-server" },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    path: "#",
    icon: <SettingsIcon className="w-5 h-5" />,
    submenu: [
      { label: "Profile", path: "/profile" },
      { label: "Preferences", path: "#" },
    ],
  },
];

export default menuItems;
