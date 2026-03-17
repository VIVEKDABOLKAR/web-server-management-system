import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useDarkMode } from "../context/DarkModeContext";

const CombinedMetricsChart = ({ metrics }) => {
  const { darkMode } = useDarkMode();

  // Format metrics data for the chart
  const formatData = () => {
    if (!metrics || metrics.length === 0) return [];
    return metrics
      .map((metric) => ({
        timestamp: new Date(metric.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        fullTime: new Date(metric.createdAt).toLocaleString(),
        networkUsage: metric.networkUsage || 0,
      }))
      .reverse(); // Show oldest to newest
  };

  const data = formatData();

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border-2 border-gray-200 dark:border-slate-700">
          <p className="text-gray-800 dark:text-gray-200 font-semibold mb-2">
            {payload[0].payload.fullTime}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm">
              <span style={{ color: entry.color }} className="font-semibold">
                {entry.name}:
              </span>{" "}
              <span className="text-gray-600 dark:text-gray-400">
                {entry.value}%
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-6xl mb-2">📊</div>
          <p>No metrics data available</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={darkMode ? "#475569" : "#e5e7eb"}
        />
        <XAxis
          dataKey="timestamp"
          stroke={darkMode ? "#94a3b8" : "#6b7280"}
          style={{ fontSize: "12px" }}
        />
        <YAxis
          stroke={darkMode ? "#94a3b8" : "#6b7280"}
          style={{ fontSize: "12px" }}
          domain={[0, 100]}
          label={{
            value: "%",
            cpu: parseFloat(metric.cpuUsage?.toFixed(2) || 0),
            memory: parseFloat(metric.memoryUsage?.toFixed(2) || 0),
            disk: parseFloat(metric.diskUsage?.toFixed(2) || 0),
            networkUsage: metric.networkUsage || 0,
            position: "insideLeft",
            style: { fill: darkMode ? "#94a3b8" : "#6b7280" },
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{
            paddingTop: "10px",
            fontSize: "14px",
            color: darkMode ? "#e5e7eb" : "#374151",
          }}
        />
        <Line
          type="monotone"
          dataKey="cpu"
          stroke={darkMode ? "#60a5fa" : "#3b82f6"}
          strokeWidth={2}
          name="CPU Usage"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="memory"
          stroke={darkMode ? "#34d399" : "#10b981"}
          strokeWidth={2}
          name="Memory Usage"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="disk"
          stroke={darkMode ? "#fbbf24" : "#f59e0b"}
          strokeWidth={2}
          name="Disk Usage"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="networkSent"
          stroke={darkMode ? "#818cf8" : "#6366f1"}
          strokeWidth={2}
          name="Net Sent (B)"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="networkRecv"
          stroke={darkMode ? "#22d3ee" : "#06b6d4"}
          strokeWidth={2}
          name="Net Recv (B)"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="processCount"
          stroke={darkMode ? "#fb7185" : "#f43f5e"}
          strokeWidth={2}
          name="Process Count"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="threadCount"
          stroke={darkMode ? "#e879f9" : "#a21caf"}
          strokeWidth={2}
          name="Thread Count"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="jvmHeapUsed"
          stroke={darkMode ? "#fdba74" : "#f97316"}
          strokeWidth={2}
          name="JVM Heap Used (B)"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="jvmHeapMax"
          stroke={darkMode ? "#f87171" : "#b91c1c"}
          strokeWidth={2}
          name="JVM Heap Max (B)"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="jvmNonHeapUsed"
          stroke={darkMode ? "#38bdf8" : "#0e7490"}
          strokeWidth={2}
          name="JVM Non-Heap Used (B)"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="jvmNonHeapMax"
          stroke={darkMode ? "#4ade80" : "#15803d"}
          strokeWidth={2}
          name="JVM Non-Heap Max (B)"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CombinedMetricsChart;
