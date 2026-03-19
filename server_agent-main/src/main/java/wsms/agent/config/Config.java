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
    private String webServerHost; //by default host is ::1 , localhost, 127.0.0.1, :::1
    private int webServerPort;
    private int publishPort;

    private Duration collectionInterval;
    private Duration blockListRefreshInterval;

    //flag
    private boolean webApplicationMonitor;

    //threshold value

    //log-level

    //constructor
    public Config() {
        // default values
        this.configPath= "config.json";

        this.backendUrl = "http://localhost:8080";
        this.webServerHost = "::1";
        this.webServerPort = 5173;
        this.publishPort = 4017;

        this.collectionInterval = Duration.ofSeconds(5);
        this.blockListRefreshInterval = Duration.ofSeconds(60);

        //flag
        this.webApplicationMonitor = true;
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

    public String getWebServerHost() {
        return webServerHost;
    }

    public void setWebServerHost(String webServerHost) {
        this.webServerHost = webServerHost;
    }

    public int getWebServerPort() {
        return webServerPort;
    }

    public void setWebServerPort(int webServerPort) {
        this.webServerPort = webServerPort;
    }

    public int getPublishPort() {
        return publishPort;
    }

    public void setPublishPort(int publishPort) {
        this.publishPort = publishPort;
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

    public boolean isWebApplicationMonitor() {
        return webApplicationMonitor;
    }

    public void setWebApplicationMonitor(boolean webApplicationMonitor) {
        this.webApplicationMonitor = webApplicationMonitor;
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
                ", webServerHost='" + webServerHost + '\'' +
                ", webServerPort=" + webServerPort +
                ", publishPort=" + publishPort +
                ", collectionInterval=" + collectionInterval +
                ", blockListRefreshInterval=" + blockListRefreshInterval +
                ", webApplicationMonitor=" + webApplicationMonitor +
                '}';
    }
}