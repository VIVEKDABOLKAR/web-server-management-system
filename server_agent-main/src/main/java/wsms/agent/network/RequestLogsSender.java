package wsms.agent.network;

import wsms.agent.model.RequestLog;
import wsms.agent.utils.JsonUtils;
import wsms.agent.utils.Logger;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

public class RequestLogsSender {
    private final String backendUrl;
    private final String authToken;
    private final HttpClient httpClient;
    private final Logger logger;

    public RequestLogsSender(String backendUrl, String authToken, Logger logger) {
        this.backendUrl = backendUrl;
        this.authToken = authToken;
        this.logger = logger;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    public boolean sendRequestLog(RequestLog requestLog) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("timestamp", requestLog.getTimestamp() == null ? null : requestLog.getTimestamp().toString());
            payload.put("serverId", requestLog.getServerId());
            payload.put("clientIP", requestLog.getClientIP());
            payload.put("method", requestLog.getMethod());
            payload.put("url", requestLog.getUrl());
            payload.put("port", requestLog.getPort());
            payload.put("statusCode", requestLog.getStatusCode());

            String jsonPayload = JsonUtils.toJson(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(backendUrl + "/api/agent/submitRequest"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + authToken)
                    .timeout(Duration.ofSeconds(10))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                logger.infof("Request log sent successfully for %s %s", requestLog.getMethod(), requestLog.getUrl());
                return true;
            }

            logger.errorf("Failed to send request log. Status: %d, Response: %s", response.statusCode(), response.body());
            return false;
        } catch (Exception ex) {
            logger.errorf("Error sending request log: %s", ex.getMessage());
            return false;
        }
    }
}