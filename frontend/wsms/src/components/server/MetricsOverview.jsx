import GaugeMetricCard from "./GaugeMetricCard";

const MAX_CPU_LOAD = 100;
const MAX_MEMORY_PRESSURE = 100;
const MAX_BANDWIDTH_MBPS = 50;

const MetricsOverview = ({ latestMetrics }) => {
    console.log(latestMetrics);
    
  const requestCount = latestMetrics?.requestCount || 0;
  const serverStatus = latestMetrics?.serverStatus || "UNKNOWN";
  const healthLabel =
    serverStatus === "ACTIVE"
      ? "Stable"
      : serverStatus === "WARNING"
        ? "Needs Attention"
        : "Critical";

  return (
    <section className="mb-8 rounded-3xl border border-slate-200/70 bg-linear-to-br from-cyan-50 via-white to-emerald-50 p-4 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 md:p-6">
      <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Metrics Command Center
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Live pulse for resource pressure and request flow.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Ingest interval: 5s
        </div>
      </div>

      {latestMetrics ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <GaugeMetricCard title="CPU Load" value={latestMetrics.cpuUsage || 0} unit="%" maxValue={MAX_CPU_LOAD} />
            <GaugeMetricCard title="Memory Pressure" value={latestMetrics.memoryUsage || 0} unit="%" maxValue={MAX_MEMORY_PRESSURE} />
            <GaugeMetricCard title="BandWidth" value={(latestMetrics.networkTraffic * 8) / (1024.0 * 1024.0) || 0} unit="Mb/s" maxValue={MAX_BANDWIDTH_MBPS} />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Request Count</p>
              <p className="mt-2 text-3xl font-black text-slate-900 dark:text-slate-100">{requestCount}</p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Requests processed in latest capture</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Total Disk Usage</p>
              <p className="mt-2 text-lg font-extrabold text-slate-900 dark:text-slate-100">{Math.round(latestMetrics.diskUsage * 100) / 100}%</p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Current health state from agent reading</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Health Insight</p>
              <p className="mt-2 text-lg font-extrabold text-slate-900 dark:text-slate-100">{healthLabel}</p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className={`h-full rounded-full ${
                    serverStatus === "ACTIVE"
                      ? "w-full bg-emerald-500"
                      : serverStatus === "WARNING"
                        ? "w-2/3 bg-amber-500"
                        : "w-1/3 bg-rose-500"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-8 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">
          No metrics available yet. Make sure the agent is running and
          configured properly.
        </div>
      )}
    </section>
  );
};

export default MetricsOverview;
