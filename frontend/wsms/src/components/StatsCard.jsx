import React from "react";

const StatsCard = ({ title, value, icon, variant = "neutral" }) => {
  const variants = {
    neutral: {
      bg: "bg-white dark:bg-slate-800",
      border: "border-gray-200 dark:border-slate-700",
      text: "text-gray-900 dark:text-white",
      value: "text-4xl",
    },
    primary: {
      bg: "bg-gradient-to-r from-sky-500 to-indigo-500 text-white",
      border: "",
      text: "text-white",
      value: "text-4xl",
    },
    success: {
      bg: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
      border: "",
      text: "text-white",
      value: "text-4xl",
    },
    warning: {
      bg: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
      border: "",
      text: "text-white",
      value: "text-4xl",
    },
    danger: {
      bg: "bg-gradient-to-r from-rose-500 to-red-500 text-white",
      border: "",
      text: "text-white",
      value: "text-4xl",
    },
  };

  const current = variants[variant] || variants.neutral;

  return (
    <div className={`rounded-xl shadow-lg border ${current.border} ${current.bg} p-4`}>      
      <div className="flex items-center gap-3">
        {icon && <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">{icon}</div>}
        <p className={`text-xs uppercase tracking-wider font-semibold ${current.text} opacity-90`}>{title}</p>
      </div>
      <p className={`mt-3 font-bold ${current.value} ${current.text}`}>{value}</p>
    </div>
  );
};

export default StatsCard;
