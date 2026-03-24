import ReactSpeedometer from "react-d3-speedometer";

const GaugeMetricCard = ({ title, value = 0, unit = "%", maxValue = 100, startColor, endColor }) => {
  const safeValue = Number.isFinite(value) ? value : 0;
  const clampedValue = Math.max(0, Math.min(safeValue, maxValue));

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
      <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
        {title}
      </div>
      <div className="mb-3 text-2xl font-bold text-slate-900 dark:text-slate-100">
        {clampedValue.toFixed(1)}{unit}
      </div>

      <div className="w-full overflow-hidden rounded-xl bg-slate-50 px-1 py-2 dark:bg-slate-800/60">
        <ReactSpeedometer
          value={clampedValue}
          minValue={0}
          maxValue={maxValue}
          segments={6}
          ringWidth={22}
          needleHeightRatio={0.62}
          needleTransitionDuration={900}
          needleTransition="easeQuadInOut"
          currentValueText=""
          customSegmentStops={[0, maxValue * 0.4, maxValue * 0.6, maxValue * 0.75, maxValue * 0.9, maxValue]}
          segmentColors={[
            "#10b981",
            "#22c55e",
            "#84cc16",
            "#f59e0b",
            "#fc0303",
          ]}
          needleColor="#0f172a"
          startColor={startColor || "#22c55e"}
          endColor={endColor || "#ef4444"}
          textColor="transparent"
          valueTextFontSize="0px"
          width={220}
          height={130}
        />
      </div>
    </div>
  );
};

export default GaugeMetricCard;