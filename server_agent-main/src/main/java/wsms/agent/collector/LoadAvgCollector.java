package wsms.agent.collector;


import oshi.SystemInfo;

public class LoadAvgCollector {
    public double collect() {
        try {
            double[] loadAvg = new SystemInfo()
                .getHardware()
                .getProcessor()
                .getSystemLoadAverage(3);
            double load = loadAvg[0]; // 1-minute load
            return (load < 0) ? 0 : load;
        } catch (Exception e) {
            return 0;
        }
    }
}
