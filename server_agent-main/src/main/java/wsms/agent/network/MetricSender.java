package wsms.agent.network;

import com.google.gson.Gson;
import wsms.agent.model.Metrics;
import wsms.agent.utils.Logger;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

public class MetricSender {
    private final String backendUrl;
    private final String authToken;
    private final Long serverId;
    private final HttpClient httpClient;
    private final Gson gson;
    private final Logger logger;

    public MetricSender(String backendUrl, String authToken, Long serverId, Logger logger) {
        this.backendUrl = backendUrl;
        this.authToken = authToken;
        this.serverId = serverId;
        this.logger = logger;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.gson = new Gson();
    }

    public boolean sendMetrics(Metrics metrics) {
        try {
            // Create payload
            Map<String, Object> payload = new HashMap<>();
            payload.put("serverId", serverId);
            payload.put("cpuUsage", metrics.getCpu());
            payload.put("memoryUsage", metrics.getMemory());
            payload.put("diskUsage", metrics.getDisk());
            payload.put("timestamp", metrics.getTimestamp().toString());

            String jsonPayload = gson.toJson(payload);

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

            String jsonPayload = gson.toJson(payload);

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