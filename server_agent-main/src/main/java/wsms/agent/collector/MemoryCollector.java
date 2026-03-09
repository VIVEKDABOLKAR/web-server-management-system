package wsms.agent.collector;

import com.sun.management.OperatingSystemMXBean;

import java.lang.management.ManagementFactory;

public class MemoryCollector {
    private final OperatingSystemMXBean osBean;

    public MemoryCollector() {
        this.osBean = (OperatingSystemMXBean) ManagementFactory.getOperatingSystemMXBean();
    }

    public double collect() {
        long total = osBean.getTotalMemorySize();
        long available = osBean.getFreeMemorySize();
        if (total <= 0) {
            return 0;
        }
        return ((double) (total - available) / (double) total) * 100.0;
    }
}
