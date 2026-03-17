package wsms.agent.collector;

import oshi.SystemInfo;
import oshi.hardware.NetworkIF;

public class NetworkTrafficCollector {
    public long collect() {
        long totalNetwork = 0;
        try {
            for (NetworkIF nic : new SystemInfo().getHardware().getNetworkIFs()) {
                nic.updateAttributes();
                totalNetwork += nic.getBytesSent() + nic.getBytesRecv();
            }
        } catch (Exception e) {
            // Optionally log error
        }
        return totalNetwork;
    }
}
