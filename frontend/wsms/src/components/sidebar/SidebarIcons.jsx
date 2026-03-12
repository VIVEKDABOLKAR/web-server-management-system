import React from "react";

// Simple SVG icons following Heroicons-like style
// All icons accept className prop for sizing/color.

export const DashboardIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 9.75L12 3l9 6.75V20a.75.75 0 01-.75.75H3.75A.75.75 0 013 20V9.75z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 22V12h6v10"
    />
  </svg>
);

export const ServersIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <rect x="3" y="4" width="18" height="6" rx="2" />
    <rect x="3" y="14" width="18" height="6" rx="2" />
    <circle cx="6" cy="7" r="1" />
    <circle cx="6" cy="17" r="1" />
  </svg>
);

export const MonitoringIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 3v18h18"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 17l3-5 4 6 5-10"
    />
  </svg>
);

export const SecurityIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
    />
  </svg>
);

export const SettingsIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0a1.724 1.724 0 002.465 1.14c.943-.385 2.047.308 2.047 1.302v1.679a1.724 1.724 0 001.178 1.629c.914.289 1.154 1.571.407 2.199l-1.358 1.093a1.724 1.724 0 00-.517 1.962c.224.715-.37 1.467-1.136 1.467h-1.982a1.724 1.724 0 00-1.593 1.178l-.433 1.684c-.2.781-1.355.781-1.555 0l-.433-1.684a1.724 1.724 0 00-1.593-1.178H7.08c-.767 0-1.36-.752-1.136-1.467a1.724 1.724 0 00-.517-1.962L3.08 9.875c-.747-.628-.507-1.91.407-2.199a1.724 1.724 0 001.178-1.629V4.368c0-.994 1.104-1.687 2.047-1.302a1.724 1.724 0 002.465-1.14z"
    />
  </svg>
);

export const UserIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.121 17.804A9 9 0 0118.879 6.196 9 9 0 015.121 17.804z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

export const LogoutIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 8v8"
    />
  </svg>
);
