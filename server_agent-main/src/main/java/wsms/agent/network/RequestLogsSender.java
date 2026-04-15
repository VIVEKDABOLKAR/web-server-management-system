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
            payload.put("statusCode", requestLog.getStatusCode());

            String jsonPayload = JsonUtils.toJson(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(backendUrl + "/api/agent/request"))
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

    public boolean isUserVerified(String serverId, String clientIp) {
        try{
                Map<String,Object> payload = new HashMap<>();
                payload.put("serverId",serverId);
                payload.put("clientIp",clientIp);

                String jsonPayload = JsonUtils.toJson(payload);

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(backendUrl+"/api/agent/isBlock"))
                        .header("Content-Type","application/json")
                        .header("Authorization","Bearer "+authToken)
                        .timeout(Duration.ofSeconds(5))
                        .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                        .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            //logger.info("response" + response.body());

            boolean isVerified = Boolean.parseBoolean(response.body());
            return  isVerified;


        }
        catch(Exception e){
            logger.errorf("Error in verification", e.getMessage());
            return false;
        }

    }
}