package wsms.agent.config;

import com.google.gson.Gson;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.Map;

public class Config {
    private String serverId;
    private Long serverIdLong;
    private String serverName;
    private String authToken;
    private String backendUrl;
    private String webSocketUrl;
    private Duration collectionInterval;

    //flag we used it in future - not now
    private boolean enableCPU;
    private boolean enableMemory;
    private boolean enableDisk;
    private boolean enableNetwork;
    private boolean enableWebServer;
    private boolean enableAlerts;
    private boolean enableIPBlocking;
    private boolean enableBackup;

    //threshold value for alert
    private double cpuThreshold;
    private double memoryThreshold;
    private double diskThreshold;

    //future flages
    private Duration blockListRefreshInterval;

    private String logLevel;
    private String logFile;

    private String webServerType;
    private int webServerPort;

    public static Config load(String path) {
        Path configPath = Path.of(path);
        if (!Files.exists(configPath)) {
            System.out.println("Config file not found, using defaults: " + path);
            return defaults();
        }

        try {
            String jsonContent = Files.readString(configPath);
            Gson gson = new Gson();
            Map<String, Object> jsonMap = gson.fromJson(jsonContent, Map.class);

            Config config = new Config();
            config.serverId = getString(jsonMap, "server_id", "kali-vm-01");
            config.serverIdLong = getLong(jsonMap, "server_id_long", 1L);
            config.serverName = getString(jsonMap, "server_name", "Default Server");
            config.authToken = getString(jsonMap, "auth_token", "");
            config.backendUrl = getString(jsonMap, "backend_url", "http://localhost:8080");
            config.webSocketUrl = getString(jsonMap, "websocket_url", "");
            config.collectionInterval = Duration.ofSeconds(getInt(jsonMap, "collection_interval", 5));
            config.blockListRefreshInterval = Duration.ofSeconds(getInt(jsonMap, "block_list_refresh_interval", 60));
            
            config.enableCPU = getBoolean(jsonMap, "enable_cpu", true);
            config.enableMemory = getBoolean(jsonMap, "enable_memory", true);
            config.enableDisk = getBoolean(jsonMap, "enable_disk", true);
            config.enableNetwork = getBoolean(jsonMap, "enable_network", false);
            config.enableWebServer = getBoolean(jsonMap, "enable_web_server", false);
            config.enableAlerts = getBoolean(jsonMap, "enable_alerts", false);
            config.enableIPBlocking = getBoolean(jsonMap, "enable_ip_blocking", false);
            config.enableBackup = getBoolean(jsonMap, "enable_backup", false);
            
            config.cpuThreshold = getDouble(jsonMap, "cpu_threshold", 80.0);
            config.memoryThreshold = getDouble(jsonMap, "memory_threshold", 85.0);
            config.diskThreshold = getDouble(jsonMap, "disk_threshold", 90.0);
            
            config.logLevel = getString(jsonMap, "log_level", "info");
            config.logFile = getString(jsonMap, "log_file", "agent.log");
            config.webServerType = getString(jsonMap, "web_server_type", "");
            config.webServerPort = getInt(jsonMap, "web_server_port", 8080);
            
            return config;
        } catch (Exception ex) {
            System.out.println("Failed to load config: " + ex.getMessage());
            return defaults();
        }
    }

    public void save(String path) throws IOException {
        String json = "{\n" +
                "  \"server_id\": \"" + safe(serverId) + "\",\n" +
                "  \"server_id_long\": " + (serverIdLong != null ? serverIdLong : 1) + ",\n" +
                "  \"server_name\": \"" + safe(serverName) + "\",\n" +
                "  \"auth_token\": \"" + safe(authToken) + "\",\n" +
                "  \"backend_url\": \"" + safe(backendUrl) + "\",\n" +
                "  \"websocket_url\": \"" + safe(webSocketUrl) + "\",\n" +
                "  \"collection_interval\": " + seconds(collectionInterval) + ",\n" +
                "  \"enable_cpu\": " + enableCPU + ",\n" +
                "  \"enable_memory\": " + enableMemory + ",\n" +
                "  \"enable_disk\": " + enableDisk + ",\n" +
                "  \"enable_network\": " + enableNetwork + ",\n" +
                "  \"enable_web_server\": " + enableWebServer + ",\n" +
                "  \"enable_alerts\": " + enableAlerts + ",\n" +
                "  \"enable_ip_blocking\": " + enableIPBlocking + ",\n" +
                "  \"enable_backup\": " + enableBackup + ",\n" +
                "  \"cpu_threshold\": " + cpuThreshold + ",\n" +
                "  \"memory_threshold\": " + memoryThreshold + ",\n" +
                "  \"disk_threshold\": " + diskThreshold + ",\n" +
                "  \"block_list_refresh_interval\": " + seconds(blockListRefreshInterval) + ",\n" +
                "  \"log_level\": \"" + safe(logLevel) + "\",\n" +
                "  \"log_file\": \"" + safe(logFile) + "\",\n" +
                "  \"web_server_type\": \"" + safe(webServerType) + "\",\n" +
                "  \"web_server_port\": " + webServerPort + "\n" +
                "}\n";
        Files.writeString(Path.of(path), json);
    }

    private static Config defaults() {
        Config config = new Config();
        config.serverId = "kali-vm-01";
        config.collectionInterval = Duration.ofSeconds(5);
        config.blockListRefreshInterval = Duration.ofSeconds(60);
        config.cpuThreshold = 80.0;
        config.memoryThreshold = 85.0;
        config.diskThreshold = 90.0;
        config.enableCPU = true;
        config.enableMemory = true;
        config.logLevel = "info";
        config.logFile = "agent.log";
        return config;
    }

    public String getServerId() {
        return serverId;
    }

    public Long getServerIdLong() {
        return serverIdLong;
    }

    public String getAuthToken() {
        return authToken;
    }

    public String getBackendUrl() {
        return backendUrl;
    }

    public Duration getCollectionInterval() {
        return collectionInterval;
    }

    public String getLogFile() {
        return logFile;
    }

    public void setServerIdLong(Long serverIdLong) {
        this.serverIdLong = serverIdLong;
    }

    public void setAuthToken(String authToken) {
        this.authToken = authToken;
    }

    private static String getString(Map<String, Object> map, String key, String defaultValue) {
        Object value = map.get(key);
        return value != null ? value.toString() : defaultValue;
    }

    private static int getInt(Map<String, Object> map, String key, int defaultValue) {
        Object value = map.get(key);
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        return defaultValue;
    }

    private static long getLong(Map<String, Object> map, String key, long defaultValue) {
        Object value = map.get(key);
        if (value instanceof Number) {
            return ((Number) value).longValue();
        }
        return defaultValue;
    }

    private static double getDouble(Map<String, Object> map, String key, double defaultValue) {
        Object value = map.get(key);
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }
        return defaultValue;
    }

    private static boolean getBoolean(Map<String, Object> map, String key, boolean defaultValue) {
        Object value = map.get(key);
        if (value instanceof Boolean) {
            return (Boolean) value;
        }
        return defaultValue;
    }

    private static String safe(String value) {
        if (value == null) {
            return "";
        }
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private static long seconds(Duration duration) {
        return duration == null ? 0 : duration.getSeconds();
    }
}
