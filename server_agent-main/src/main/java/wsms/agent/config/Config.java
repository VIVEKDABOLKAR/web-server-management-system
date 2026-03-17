package wsms.agent.config;

import java.time.Duration;

public class Config {

    //static
    private String serverId;
    private String serverName;
    private String authToken;
    private String configPath;

    //variable

    //url
    private String backendUrl;
    private String webSocketUrl; //did not implement

    private Duration collectionInterval;
    private Duration blockListRefreshInterval;

    //matrics-flag

    //threshold value

    //log-level

    //constructor
    public Config() {
        // default values
        this.collectionInterval = Duration.ofSeconds(5);
        this.blockListRefreshInterval = Duration.ofSeconds(60);
        this.backendUrl = "http://localhost:8080";
    }

    //getter and setter

    public String getServerId() {
        return serverId;
    }

    public void setServerId(String serverId) {
        this.serverId = serverId;
    }

    public String getServerName() {
        return serverName;
    }

    public void setServerName(String serverName) {
        this.serverName = serverName;
    }

    public String getAuthToken() {
        return authToken;
    }

    public void setAuthToken(String authToken) {
        this.authToken = authToken;
    }

    public String getConfigPath() {
        return configPath;
    }

    public void setConfigPath(String configPath) {
        this.configPath = configPath;
    }

    public String getBackendUrl() {
        return backendUrl;
    }

    public void setBackendUrl(String backendUrl) {
        this.backendUrl = backendUrl;
    }

    public String getWebSocketUrl() {
        return webSocketUrl;
    }

    public void setWebSocketUrl(String webSocketUrl) {
        this.webSocketUrl = webSocketUrl;
    }

    public Duration getCollectionInterval() {
        return collectionInterval;
    }

    public void setCollectionInterval(Duration collectionInterval) {
        this.collectionInterval = collectionInterval;
    }

    public Duration getBlockListRefreshInterval() {
        return blockListRefreshInterval;
    }

    public void setBlockListRefreshInterval(Duration blockListRefreshInterval) {
        this.blockListRefreshInterval = blockListRefreshInterval;
    }

    //to string method

    @Override
    public String toString() {
        return "Config{" +
                "serverId='" + serverId + '\'' +
                ", serverName='" + serverName + '\'' +
                ", authToken='" + authToken + '\'' +
                ", configPath='" + configPath + '\'' +
                ", backendUrl='" + backendUrl + '\'' +
                ", webSocketUrl='" + webSocketUrl + '\'' +
                ", collectionInterval=" + collectionInterval +
                ", blockListRefreshInterval=" + blockListRefreshInterval +
                '}';
    }
}