package com.wsms.controller;

import com.wsms.dto.metric.MetricResponse;
import com.wsms.dto.metric.MetricSubmitRequest;
import com.wsms.dto.requestlog.RequestLogResponse;
import com.wsms.dto.requestlog.RequestLogSubmitRequest;
import com.wsms.entity.Server;
import com.wsms.entity.ServerStatus;
import com.wsms.repository.ServerRepository;
import com.wsms.service.MetricService;
import com.wsms.service.RequestLogService;
import com.wsms.utils.alertSystem.AlertSystem;
import com.wsms.utils.installScript.InstallScript;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/agent")
@RequiredArgsConstructor
public class AgentController {

        // DI
        private final MetricService metricService;
        private final ServerRepository serverRepository;
        private final AlertSystem alertSystem;
        private final InstallScript installScript;
        private final RequestLogService requestLogService;

        @GetMapping(value = "/install.sh", produces = MediaType.TEXT_PLAIN_VALUE)
        public ResponseEntity<String> getInstallScriptTemplate() {
                return ResponseEntity.ok()
                        .contentType(MediaType.TEXT_PLAIN)
                        .body(installScript.generatePublicTemplate());
        }

        /**
         * agent send matrics to this backend using this /api/agent/metrics
         * it will store matrics inside db
         * pass it through alert system
         * if alert created, store in db
         *
         * @param authHeader
         * @param request
         * @return
         */
        @PostMapping("/metrics")
        public ResponseEntity<Map<String, Object>> submitMetrics(
                @RequestHeader("Authorization") String authHeader,
                @Valid @RequestBody MetricSubmitRequest request) {

                // log server matrics
//                log.info("Received metrics from agent. Server ID: {}, CPU: {}%, Memory: {}%, Disk: {}%, Request: {}%",
//                        request.getServerId(),
//                        request.getCpuUsage(),
//                        request.getMemoryUsage(),
//                        request.getDiskUsage(),
//                        request.getRequestCount());

                // Extract token from "Bearer <token>" format
                String token = authHeader.replace("Bearer ", "");

                // Verify server exists and token matches
                Server server = serverRepository.findById(request.getServerId())
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Server not found"));

                // validate agent token
                if (!server.getAgentToken().equals(token)) {
                        log.warn("Invalid agent token for server ID: {}", request.getServerId());
                        throw new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Invalid agent token");
                }

                // Submit metric
                MetricResponse response = metricService.submitMetric(request);

                // send metrics to alert system
                boolean alertOccured = alertSystem.evaluate(server, request);

                // just for test :- remove it during commit
                if (!alertOccured) {
                        System.out.println(
                                "Alert not occured .......................................................................................");
                } else {
                        System.out.println(
                                "Alert occured ##########################################################################################");
                }

                Map<String, Object> result = new HashMap<>();
                result.put("success", true);
                result.put("message", "Metrics received successfully");
                result.put("metricId", response.getId());
                // result.put("serverStatus", response.getServerStatus()); // Removed: MetricResponse has no serverStatus

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
                                "Server not found"));

                if (!server.getAgentToken().equals(token)) {
                        throw new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Invalid agent token");
                }

                // create service layer for this :- serverService.updateLastHeatBeat
                server.setLastHeartbeat(LocalDateTime.now());
                serverRepository.save(server);

                Map<String, Object> result = new HashMap<>();
                result.put("success", true);
                result.put("message", "Heartbeat acknowledged");

                return ResponseEntity.ok(result);
        }

        /**
         * Receive request logs from agent
         * Stores client IP, HTTP method, URL, port, and status code
         * Used for request analysis and IP blocking features
         *
         * @param authHeader
         * @param request
         * @return
         */
        @PostMapping("/request")
        public ResponseEntity<Map<String, Object>> submitRequestLog(
                @RequestHeader("Authorization") String authHeader,
                @Valid @RequestBody RequestLogSubmitRequest request) {

                log.info("Received request log from agent. Server ID: {}, Client IP: {}, Method: {}, URL: {}",
                        request.getServerId(), request.getClientIP(), request.getMethod(), request.getUrl());

                // Extract token from "Bearer <token>" format
                String token = authHeader.replace("Bearer ", "");

                // Verify server exists and token matches
                Server server = serverRepository.findById(request.getServerId())
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Server not found"));

                // Validate agent token
                if (!server.getAgentToken().equals(token)) {
                        log.warn("Invalid agent token for server ID: {}", request.getServerId());
                        throw new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Invalid agent token");
                }

                // Submit request log
                RequestLogResponse response = requestLogService.submitRequestLog(request);

                Map<String, Object> result = new HashMap<>();
                result.put("success", true);
                result.put("message", "Request log received successfully");
                result.put("requestLogId", response.getId());

                return ResponseEntity.ok(result);
        }
}

