package com.wsms.controller;

import com.wsms.dto.metric.MetricResponse;
import com.wsms.dto.metric.MetricSubmitRequest;
import com.wsms.entity.Server;
import com.wsms.repository.ServerRepository;
import com.wsms.service.MetricService;
import com.wsms.utils.alertSystem.AlertSystem;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/agent")
@RequiredArgsConstructor
public class AgentController {

    //DI
    private final MetricService metricService;
    private final ServerRepository serverRepository;
    private final AlertSystem alertSystem;

    @PostMapping("/metrics")
    public ResponseEntity<Map<String, Object>> submitMetrics(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody MetricSubmitRequest request) {
        
        log.info("Received metrics from agent. Server ID: {}, CPU: {}%, Memory: {}%, Disk: {}%", 
                request.getServerId(), 
                request.getCpuUsage(), 
                request.getMemoryUsage(),
                request.getDiskUsage());

        // Extract token from "Bearer <token>" format
        String token = authHeader.replace("Bearer ", "");
        
        // Verify server exists and token matches
        Server server = serverRepository.findById(request.getServerId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, 
                        "Server not found"
                ));

        //validate agent token
        if (!server.getAgentToken().equals(token)) {
            log.warn("Invalid agent token for server ID: {}", request.getServerId());
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, 
                    "Invalid agent token"
            );
        }

        // Submit metric
        MetricResponse response = metricService.submitMetric(request);

        //send metrics to alert system
        boolean alertOccured = alertSystem.evaluate(server, request);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "Metrics received successfully");
        result.put("metricId", response.getId());
        result.put("serverStatus", response.getServerStatus());

        return ResponseEntity.ok(result);
    }

    @PostMapping("/heartbeat")
    public ResponseEntity<Map<String, Object>> heartbeat(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> request) {
        
        Long serverId = ((Number) request.get("serverId")).longValue();
        String token = authHeader.replace("Bearer ", "");
        
        log.info("Heartbeat received from server ID: {}", serverId);

        Server server = serverRepository.findById(serverId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, 
                        "Server not found"
                ));

        if (!server.getAgentToken().equals(token)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, 
                    "Invalid agent token"
            );
        }

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "Heartbeat acknowledged");

        return ResponseEntity.ok(result);
    }
}
