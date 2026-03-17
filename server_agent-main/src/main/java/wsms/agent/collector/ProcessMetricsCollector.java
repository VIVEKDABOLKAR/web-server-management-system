package wsms.agent.collector;

import oshi.SystemInfo;
import oshi.software.os.OSProcess;
import oshi.software.os.OperatingSystem;

public class ProcessMetricsCollector {
    public ProcessMetrics collect() {
        ProcessMetrics metrics = new ProcessMetrics();
        try {
            OperatingSystem os = new SystemInfo().getOperatingSystem();
            int running = 0, sleeping = 0, blocked = 0;
            for (OSProcess p : os.getProcesses(null, null, 0)) {
                switch (p.getState()) {
                    case RUNNING:
                        running++;
                        break;
                    case WAITING:
                    case SLEEPING:
                    case OTHER:
                        sleeping++;
                        break;
                    case STOPPED:
                        blocked++;
                        break;
                    default:
                        sleeping++;
                }
            }
            metrics.running = running;
            metrics.sleeping = sleeping;
            metrics.blocked = blocked;
            metrics.total = os.getProcessCount();
        } catch (Exception e) {
            metrics.running = 0;
            metrics.sleeping = 0;
            metrics.blocked = 0;
            metrics.total = 0;
        }
        return metrics;
    }

    public static class ProcessMetrics {
        public int running;
        public int sleeping;
        public int blocked;
        public int total;
    }
}
