package com.wsms.service;

import com.wsms.dto.metric.MetricResponse;
import com.wsms.dto.metric.MetricSubmitRequest;
import com.wsms.entity.Metric;
import com.wsms.entity.Server;
import com.wsms.entity.ServerStatus;
import com.wsms.repository.MetricRepository;
import com.wsms.repository.ServerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MetricService {

    private final MetricRepository metricRepository;
    private final ServerRepository serverRepository;

    @Transactional
    public MetricResponse submitMetric(MetricSubmitRequest request) {
        log.info("Receiving metric from server ID: {}", request.getServerId());
        
        // Find server by ID
        Server server = serverRepository.findById(request.getServerId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, 
                        "Server not found with ID: " + request.getServerId()
                ));

        // Determine server status based on CPU and memory usage
        ServerStatus status = ServerStatus.ACTIVE; //for now testing put status by defult

        // Update server status if changed
        if (server.getStatus() != status) {
            server.setStatus(status);
            serverRepository.save(server);
            log.info("Server {} status updated to {}", server.getServerName(), status);
        }

        // Create and save metric
        Long requestCount = request.getRequestCount();
        Metric metric = Metric.builder()
                .server(server)
                .cpuUsage(request.getCpuUsage())
                .memoryUsage(request.getMemoryUsage())
                .diskUsage(request.getDiskUsage())
                .requestCount(requestCount != null ? requestCount : 0L)
                .serverStatus(status)
                .build();

        metric = metricRepository.save(metric);
        log.info("Metric saved successfully for server: {}", server.getServerName());

        return toResponse(metric);
    }

    @Transactional(readOnly = true)
    public List<MetricResponse> getMetricsByServer(Long serverId, Long userId) {
        Server server = serverRepository.findById(serverId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, 
                        "Server not found"
                ));

        // Verify server belongs to user
        if (!server.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        List<Metric> metrics = metricRepository.findTop100ByServerOrderByCreatedAtDesc(server);
        return metrics.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<MetricResponse> getRecentMetricsByServer(Long serverId, int hours, Long userId) {
        Server server = serverRepository.findById(serverId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, 
                        "Server not found"
                ));

        if (!server.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusHours(hours);

        List<Metric> metrics = metricRepository
                .findByServerAndCreatedAtBetweenOrderByCreatedAtDesc(server, startDate, endDate);
        
        return metrics.stream().map(this::toResponse).toList();
    }

//    private ServerStatus determineServerStatus(Double cpuUsage, Double memoryUsage, Double diskUsage) {
//        // Check if any metric is critically high
//        if ((cpuUsage != null && cpuUsage > 90) ||
//            (memoryUsage != null && memoryUsage > 90) ||
//            (diskUsage != null && diskUsage > 95)) {
//            return ServerStatus.ERROR;
//        }
//
//        // Check if any metric is moderately high
//        if ((cpuUsage != null && cpuUsage > 75) ||
//            (memoryUsage != null && memoryUsage > 75) ||
//            (diskUsage != null && diskUsage > 85)) {
//            return ServerStatus.WARNING;
//        }
//
//        return ServerStatus.ACTIVE;
//    }

    private MetricResponse toResponse(Metric metric) {
        return MetricResponse.builder()
                .id(metric.getId())
                .cpuUsage(metric.getCpuUsage())
                .memoryUsage(metric.getMemoryUsage())
                .diskUsage(metric.getDiskUsage())
                .requestCount(metric.getRequestCount())
                .serverStatus(metric.getServerStatus().name())
                .createdAt(metric.getCreatedAt())
                .serverId(metric.getServer().getId())
                .serverName(metric.getServer().getServerName())
                .build();
    }
}
