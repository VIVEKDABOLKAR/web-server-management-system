import { useState } from "react";
import MetricsChart from "../MetricsChart";
import CombinedMetricsChart from "../CombinedMetricsChart";

const PerformanceTrends = ({ metrics }) => {
  const [chartView, setChartView] = useState("individual"); // 'individual' or 'combined'

  if (!metrics || metrics.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Performance Trends
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setChartView("individual")}
            className={`px-3 py-2 rounded text-sm font-medium transition ${
              chartView === "individual"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600"
            }`}
          >
            Individual
          </button>
          <button
            onClick={() => setChartView("combined")}
            className={`px-3 py-2 rounded text-sm font-medium transition ${
              chartView === "combined"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600"
            }`}
          >
            Combined
          </button>
        </div>
      </div>

      {chartView === "individual" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CPU Chart */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-5 rounded shadow">
            <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4">
              CPU Usage
            </h3>
            <MetricsChart metrics={metrics} type="cpu" />
          </div>

          {/* Memory Chart */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-5 rounded shadow">
            <h3 className="text-lg font-bold text-green-600 dark:text-green-400 mb-4">
              Memory Usage
            </h3>
            <MetricsChart metrics={metrics} type="memory" />
          </div>

          {/* Disk Chart */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-5 rounded shadow">
            <h3 className="text-lg font-bold text-amber-600 dark:text-amber-400 mb-4">
              Request Count
            </h3>
            <MetricsChart metrics={metrics} type="requestCount" />
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-5 rounded shadow">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
            All Metrics Combined
          </h3>
          <CombinedMetricsChart metrics={metrics} />
        </div>
      )}
    </div>
  );
};

export default PerformanceTrends;
