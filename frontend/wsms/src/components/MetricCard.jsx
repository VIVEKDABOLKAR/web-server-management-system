const MetricCard = ({ title, value, unit, max = 100 }) => {
  const percentage = (value / max) * 100;
  let colorClass = "bg-green-500";

  if (percentage > 80) {
    colorClass = "bg-red-500";
  } else if (percentage > 60) {
    colorClass = "bg-yellow-500";
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-gray-600 text-sm font-medium uppercase mb-2">
        {title}
      </h3>
      <p className="text-3xl font-bold text-gray-800 mb-3">
        {value}
        {unit}
      </p>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all ${colorClass}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default MetricCard;
