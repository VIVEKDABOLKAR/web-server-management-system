package wsms.agent.network;

import wsms.agent.model.Metrics;
import wsms.agent.monitor.ConnectionMonitor;
import wsms.agent.utils.JsonUtils;
import wsms.agent.utils.Logger;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import com.google.gson.Gson;

import wsms.agent.model.Metrics;
import wsms.agent.utils.Logger;

public class MetricSender {
    private final String backendUrl;
    private final String authToken;
    private final Long serverId;
    private final HttpClient httpClient;
    private final Logger logger;

    public MetricSender(String backendUrl, String authToken, Long serverId, Logger logger) {
        this.backendUrl = backendUrl;
        this.authToken = authToken;
        this.serverId = serverId;
        this.logger = logger;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();

    }

    public boolean sendMetrics(Metrics metrics) {
        try {
            // Create payload with only required fields
            Map<String, Object> payload = new HashMap<>();
            payload.put("serverId", serverId);
            payload.put("cpuUsage", metrics.getCpuUsage());
            payload.put("loadAvg1m", metrics.getLoadAvg1m());
            payload.put("memoryUsage", metrics.getMemoryUsage());
            payload.put("diskUsage", metrics.getDiskUsage());
            payload.put("diskReadPerSec", metrics.getDiskReadPerSec());
            payload.put("diskWritePerSec", metrics.getDiskWritePerSec());
            payload.put("networkTraffic", metrics.getNetworkTraffic());
            payload.put("runningProcesses", metrics.getRunningProcesses());
            payload.put("sleepingProcesses", metrics.getSleepingProcesses());
            payload.put("blockedProcesses", metrics.getBlockedProcesses());
            payload.put("totalProcesses", metrics.getTotalProcesses());
            payload.put("timestamp", metrics.getTimestamp().toString());
            payload.put("requestCount", metrics.getRequestCount());

            String jsonPayload = JsonUtils.toJson(payload);

            // Build request
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(backendUrl + "/api/agent/metrics"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + authToken)
                    .timeout(Duration.ofSeconds(10))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            // Send request
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                logger.info("✓ Metrics sent successfully to backend");
                return true;
            } else {
                logger.errorf("✗ Failed to send metrics. Status: %d, Response: %s",
                        response.statusCode(), response.body());
                return false;
            }
        } catch (Exception ex) {
            logger.errorf("✗ Error sending metrics to backend: %s", ex.getMessage());
            return false;
        }
    }

    public boolean sendHeartbeat() {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("serverId", serverId);
            payload.put("status", "ACTIVE");

            String jsonPayload = JsonUtils.toJson(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(backendUrl + "/api/agent/heartbeat"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + authToken)
                    .timeout(Duration.ofSeconds(10))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                logger.info("✓ Heartbeat sent successfully");
                return true;
            } else {
                logger.errorf("✗ Failed to send heartbeat. Status: %d", response.statusCode());
                return false;
            }
        } catch (Exception ex) {
            logger.errorf("✗ Error sending heartbeat: %s", ex.getMessage());
            return false;
        }
    }
}