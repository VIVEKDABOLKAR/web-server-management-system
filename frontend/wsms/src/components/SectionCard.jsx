const SectionCard = ({ title, actionButton, children }) => (
  <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
    <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        {title}
      </h2>
      {actionButton && <div>{actionButton}</div>}
    </div>
    <div className="p-4">{children}</div>
  </section>
);

export default SectionCard;