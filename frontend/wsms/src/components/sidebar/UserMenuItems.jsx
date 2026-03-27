import {
  DashboardIcon,
  MonitoringIcon,
  SecurityIcon,
  ServersIcon,
  SettingsIcon,
} from "./SidebarIcons";

/** Sidebar menu config */
const UserMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon className="w-5 h-5" />,
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
      { label: "Alerts", path: `/alerts` },
      { label: "Logs", path: "/log" },
    ],
  },
  {
    id: "security",
    label: "Security",
    path: "#",
    icon: <SecurityIcon className="w-5 h-5" />,
    submenu: [
      { label: "Blocked IPs", path: "/ipBlocks" },
      { label: "Access Control", path: "#" },
      { label: "Firewall Rules", path: "#" },
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

export default UserMenuItems;
