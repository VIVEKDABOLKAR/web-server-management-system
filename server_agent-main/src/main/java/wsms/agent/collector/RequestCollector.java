package wsms.agent.collector;

import wsms.agent.monitor.ConnectionMonitor;

public class RequestCollector {
    private final ConnectionMonitor connectionMonitor;

    public RequestCollector(ConnectionMonitor connectionMonitor) {
        this.connectionMonitor = connectionMonitor;
    }

    public Integer collect()  {
        return connectionMonitor.getReqCount();
    }

//    public Integer collectBetween(int interval) {
//        connectionMonitor.getReqCount();
//    }
}
