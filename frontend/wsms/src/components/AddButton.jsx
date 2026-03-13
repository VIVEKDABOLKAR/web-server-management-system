import React from "react";

/**
 * Generic reusable Add Button component
 * @param {Object} props - Component props
 * @param {string} props.title - Button title/text (e.g., "Add Server", "Add User")
 * @param {function} props.onClick - Click handler function
 * @param {string} props.variant - Button style variant: 'primary' (default), 'secondary', 'outline'
 * @param {string} props.size - Button size: 'sm', 'md' (default), 'lg'
 * @param {string} props.icon - Optional icon element (e.g., icon component)
 * @param {boolean} props.disabled - Disable button state
 * @param {string} props.className - Additional custom classes
 * @returns {JSX.Element}
 */
const AddButton = ({
  title = "Add",
  onClick,
  variant = "primary",
  size = "md",
  icon = null,
  disabled = false,
  className = "",
}) => {
  // Variant styles
  const variantStyles = {
    primary:
      "bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800 disabled:bg-sky-400 dark:bg-sky-900",
    secondary:
      "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600 active:bg-slate-400 disabled:bg-slate-300",
    outline:
      "border-2 border-sky-600 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-900 active:bg-sky-100 disabled:border-sky-400 disabled:text-sky-400",
  };

  // Size styles
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center font-medium rounded-lg transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{title}</span>
    </button>
  );
};

export default AddButton;
