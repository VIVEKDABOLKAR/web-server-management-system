package com.wsms.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.wsms.dto.metric.MetricResponse;
import com.wsms.dto.metric.MetricSubmitRequest;
import com.wsms.entity.Metric;
import com.wsms.entity.Server;
import com.wsms.entity.ServerStatus;
import com.wsms.repository.MetricRepository;
import com.wsms.repository.ServerRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MetricService {

    private final MetricRepository metricRepository;
    private final ServerRepository serverRepository;

    /**
     * Save metrics coming from agent
     */
    @Transactional
    public MetricResponse submitMetric(MetricSubmitRequest request) {

        log.info("Receiving metric from server ID: {}", request.getServerId());

        // 1. Validate server
        Server server = serverRepository.findById(request.getServerId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Server not found with ID: " + request.getServerId()
                ));

        // 2. Update server status
        ServerStatus status = ServerStatus.ACTIVE;

        if (server.getStatus() != status) {
            server.setStatus(status);
            server.setLastHeartbeat(LocalDateTime.now()); // IMPORTANT
            serverRepository.save(server);

            log.info("Server {} status updated to {}", server.getServerName(), status);
        }

        // 3. Map request → entity (FIXED)
        Metric metric = Metric.builder()
                .server(server)
                .cpuUsage(request.getCpuUsage())
                .loadAvg1m(request.getLoadAvg1m())
                .memoryUsage(request.getMemoryUsage())
                .diskUsage(request.getDiskUsage())
                .diskReadPerSec(request.getDiskReadPerSec())
                .diskWritePerSec(request.getDiskWritePerSec())
                .networkTraffic(request.getNetworkTraffic())
                .runningProcesses(request.getRunningProcesses())
                .sleepingProcesses(request.getSleepingProcesses())
                .blockedProcesses(request.getBlockedProcesses())
                .totalProcesses(request.getTotalProcesses())
                .requestCount(request.getRequestCount())

                .build();

        // 4. Save metric
        metric = metricRepository.save(metric);

        log.info("Metric saved successfully for server: {}", server.getServerName());

        // 5. Return response
        return toResponse(metric);
    }

    /**
     * Get latest 100 metrics
     */
    @Transactional(readOnly = true)
    public List<MetricResponse> getMetricsByServer(Long serverId, Long userId) {

        Server server = serverRepository.findById(serverId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Server not found"
                ));

        // Security check
        if (!server.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        List<Metric> metrics =
                metricRepository.findTop100ByServerOrderByCreatedAtDesc(server);

        return metrics.stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Get metrics for last N hours
     */
    @Transactional(readOnly = true)
    public List<MetricResponse> getRecentMetricsByServer(Long serverId, int hours, Long userId) {

        Server server = serverRepository.findById(serverId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Server not found"
                ));

        // Security check
        if (!server.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusHours(hours);

        List<Metric> metrics = metricRepository
                .findByServerAndCreatedAtBetweenOrderByCreatedAtDesc(
                        server, startDate, endDate
                );

        return metrics.stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Convert Entity → Response DTO (FIXED)
     */
    private MetricResponse toResponse(Metric metric) {

        return MetricResponse.builder()
                .id(metric.getId())
                .cpuUsage(metric.getCpuUsage())
                .loadAvg1m(metric.getLoadAvg1m())
                .memoryUsage(metric.getMemoryUsage())
                .diskUsage(metric.getDiskUsage())
                .diskReadPerSec(metric.getDiskReadPerSec())
                .diskWritePerSec(metric.getDiskWritePerSec())
                .networkTraffic(metric.getNetworkTraffic())
                .runningProcesses(metric.getRunningProcesses())
                .sleepingProcesses(metric.getSleepingProcesses())
                .blockedProcesses(metric.getBlockedProcesses())
                .totalProcesses(metric.getTotalProcesses())
                .requestCount(metric.getRequestCount())
                .createdAt(metric.getCreatedAt())
                .serverId(metric.getServer().getId())
                .serverName(metric.getServer().getServerName())
                .serverStatus("ACTIVE")
                .build();
    }
}