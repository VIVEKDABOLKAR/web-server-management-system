import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useDarkMode } from "../context/DarkModeContext";

const MetricsTooltip = ({ active, payload, config, darkMode }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border-2 border-gray-200 dark:border-slate-700">
        <p className="text-gray-800 dark:text-gray-200 font-semibold mb-1">
          {payload[0].payload.fullTime}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          {config.name}:{" "}
          <span
            className="font-bold"
            style={{ color: darkMode ? config.darkColor : config.color }}
          >
            {payload[0].value}
            {config.unit}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const MetricsChart = ({ metrics, type = "cpu" }) => {
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
        cpu: parseFloat(metric.cpuUsage?.toFixed(2) || 0),
        memory: parseFloat(metric.memoryUsage?.toFixed(2) || 0),
        disk: parseFloat(metric.diskUsage?.toFixed(2) || 0),
        requestCount: parseInt(metric.requestCount || -1),
        networkUsage: metric.networkUsage || 0,
      }))
      .reverse(); // Show oldest to newest
  };

  const data = formatData();
  const isRequestCountChart = type === "requestCount";

  const chartConfig = {
    cpu: {
      dataKey: "cpu",
      name: "CPU Usage",
      color: "#3b82f6",
      darkColor: "#60a5fa",
      unit: "%",
    },
    memory: {
      dataKey: "memory",
      name: "Memory Usage",
      color: "#10b981",
      darkColor: "#34d399",
      unit: "%",
    },
    disk: {
      dataKey: "disk",
      name: "Disk Usage",
      color: "#f59e0b",
      darkColor: "#fbbf24",
      unit: "%",
    },
    requestCount: {
      dataKey: "requestCount",
      name: "Request Count",
      color: "#f59e0b",
      darkColor: "#fbbf24",
      unit: "",
    },
    networkUsage: {
      dataKey: "networkUsage",
      name: "Network Usage (B/s)",
      color: "#6366f1",
      darkColor: "#818cf8",
      unit: "B/s",
    },
  };

  const config = chartConfig[type];

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-6xl mb-2">📊</div>
          <p>No metrics data available</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      {isRequestCountChart ? (
        <BarChart data={data}>
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
            domain={[1, 20]}
            allowDecimals={false}
          />
          <Tooltip content={(props) => <MetricsTooltip {...props} config={config} darkMode={darkMode} />} />
          <Legend
            wrapperStyle={{
              paddingTop: "10px",
              fontSize: "14px",
              color: darkMode ? "#e5e7eb" : "#374151",
            }}
          />
          <Bar
            dataKey={config.dataKey}
            name={config.name}
            fill={darkMode ? config.darkColor : config.color}
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      ) : (
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`color${type}`} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={darkMode ? config.darkColor : config.color}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={darkMode ? config.darkColor : config.color}
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
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
              value: config.unit,
              angle: -90,
              position: "insideLeft",
              style: { fill: darkMode ? "#94a3b8" : "#6b7280" },
            }}
          />
          <Tooltip content={(props) => <MetricsTooltip {...props} config={config} darkMode={darkMode} />} />
          <Legend
            wrapperStyle={{
              paddingTop: "10px",
              fontSize: "14px",
              color: darkMode ? "#e5e7eb" : "#374151",
            }}
          />
          <Area
            type="monotone"
            dataKey={config.dataKey}
            stroke={darkMode ? config.darkColor : config.color}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#color${type})`}
            name={config.name}
          />
        </AreaChart>
      )}
    </ResponsiveContainer>
  );
};

export default MetricsChart;
