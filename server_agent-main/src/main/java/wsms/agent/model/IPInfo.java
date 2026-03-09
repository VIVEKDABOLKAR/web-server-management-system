package wsms.agent.model;

import java.time.Instant;
import java.util.List;

public class IPInfo {
    private String serverId;
    private List<String> ipAddresses;
    private String primaryIP;
    private Instant timestamp;

    public String getServerId() {
        return serverId;
    }

    public void setServerId(String serverId) {
        this.serverId = serverId;
    }

    public List<String> getIpAddresses() {
        return ipAddresses;
    }

    public void setIpAddresses(List<String> ipAddresses) {
        this.ipAddresses = ipAddresses;
    }

    public String getPrimaryIP() {
        return primaryIP;
    }

    public void setPrimaryIP(String primaryIP) {
        this.primaryIP = primaryIP;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}
