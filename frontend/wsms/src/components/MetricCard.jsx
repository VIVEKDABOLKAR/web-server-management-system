const MetricCard = ({ title, value, unit, max = 100 }) => {
  const percentage = (value / max) * 100;
  let colorClass = "bg-green-500";

  if (percentage > 80) {
    colorClass = "bg-red-500";
  } else if (percentage > 60) {
    colorClass = "bg-yellow-500";
  }

  // Format value to 2 decimal places for percentages, round for counts
  const formattedValue =
    unit === "%" ? parseFloat(value).toFixed(2) : Math.round(value);

  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded shadow border border-gray-200 dark:border-slate-700">
      <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium uppercase mb-2">
        {title}
      </h3>
      <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
        {formattedValue}
        {unit}
      </p>
      <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all ${colorClass}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default MetricCard;
