const MetricCard = ({ title, value, unit, max = 100 }) => {
  const percentage = (value / max) * 100;
  let colorClass = "bg-green-500";

  if (percentage > 80) {
    colorClass = "bg-red-500";
  } else if (percentage > 60) {
    colorClass = "bg-yellow-500";
  }

    // Utility to format bytes as short, human-readable strings
    function humanReadableBytes(bytes) {
      if (bytes < 1024) return `${Math.round(bytes)} B`;
      const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
      let i = -1;
      do {
        bytes /= 1024;
        i++;
      } while (bytes >= 1024 && i < units.length - 1);
      return `${bytes.toFixed(1)} ${units[i]}`;
    }
    // Format value: human-readable for bytes, 2 decimals for %, round for counts
    let formattedValue;
    if (unit === "%") {
      formattedValue = parseFloat(value).toFixed(2);
    } else if (typeof unit === 'string' && unit.match(/B|B\/s|Bytes|KB|MB|GB|TB/i)) {
      formattedValue = humanReadableBytes(value);
    } else {
      formattedValue = Math.round(value);
    }

  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded shadow border border-gray-200 dark:border-slate-700">
      <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium uppercase mb-2">
        {title}
      </h3>
      <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
        {typeof unit === 'string' && unit.match(/B|B\/s|Bytes|KB|MB|GB|TB/i) ? `${formattedValue}/s` : `${formattedValue}${unit}`}
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
