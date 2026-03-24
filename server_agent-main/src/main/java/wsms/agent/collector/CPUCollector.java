package wsms.agent.collector;

import com.sun.management.OperatingSystemMXBean;

import java.lang.management.ManagementFactory;

public class CPUCollector {
    private final OperatingSystemMXBean osBean;

    public CPUCollector() {
        this.osBean = (OperatingSystemMXBean) ManagementFactory.getOperatingSystemMXBean();
    }

    public double collect() throws InterruptedException {
//        Thread.sleep(1000);
        double cpuLoad = osBean.getCpuLoad();
        if (cpuLoad < 0) {
            return 0;
        }
        return cpuLoad * 100.0;
    }
}
