import * as React from "react";

export function Card({ className = "", ...props }) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 ${className}`.trim()}
      {...props}
    />
  );
}

export function CardContent({ className = "", ...props }) {
  return <div className={`p-4 ${className}`.trim()} {...props} />;
}
