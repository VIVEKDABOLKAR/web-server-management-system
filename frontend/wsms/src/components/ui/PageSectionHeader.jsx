import React from "react";

const toneMap = {
  neutral:
    "border-slate-300/80 bg-white/90 text-slate-700 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200",
  cyan:
    "border-cyan-300/80 bg-cyan-50 text-cyan-800 dark:border-cyan-700/70 dark:bg-cyan-900/30 dark:text-cyan-200",
  rose:
    "border-rose-300/80 bg-rose-50 text-rose-800 dark:border-rose-700/70 dark:bg-rose-900/30 dark:text-rose-200",
  amber:
    "border-amber-300/80 bg-amber-50 text-amber-800 dark:border-amber-700/70 dark:bg-amber-900/30 dark:text-amber-200",
  emerald:
    "border-emerald-300/80 bg-emerald-50 text-emerald-800 dark:border-emerald-700/70 dark:bg-emerald-900/30 dark:text-emerald-200",
  indigo:
    "border-indigo-300/80 bg-indigo-50 text-indigo-800 dark:border-indigo-700/70 dark:bg-indigo-900/30 dark:text-indigo-200",
};

const PageSectionHeader = ({
  eyebrow,
  title,
  description,
  icon,
  badges = [],
  actions,
  className = "",
}) => {
  return (
    <section
      className={`rounded-3xl border border-slate-300/80 bg-linear-to-r from-white/95 via-cyan-50/70 to-blue-50/80 p-5 shadow-lg backdrop-blur dark:border-slate-700 dark:from-slate-900/85 dark:via-slate-900/75 dark:to-cyan-950/35 ${className}`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/70 bg-cyan-100/90 text-cyan-700 shadow-sm dark:border-cyan-700/70 dark:bg-cyan-900/40 dark:text-cyan-200">
            {icon}
          </div>

          <div>
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700/90 dark:text-cyan-300/90">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 md:text-3xl">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{description}</p>
            ) : null}
          </div>
        </div>

        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>

      {badges.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2.5">
          {badges.map((badge) => (
            <div
              key={`${badge.label}-${badge.value}`}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm ${toneMap[badge.tone] || toneMap.neutral}`}
            >
              <span className="text-xs uppercase tracking-[0.12em] opacity-80">{badge.label}</span>
              <span className="font-bold">{badge.value}</span>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default PageSectionHeader;
