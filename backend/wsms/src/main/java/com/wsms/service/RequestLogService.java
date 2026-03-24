package com.wsms.service;

import com.wsms.dto.requestlog.RequestLogResponse;
import com.wsms.dto.requestlog.RequestLogSubmitRequest;
import com.wsms.entity.RequestLog;
import com.wsms.entity.Server;
import com.wsms.repository.RequestLogRepository;
import com.wsms.repository.ServerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RequestLogService {

    private final RequestLogRepository requestLogRepository;
    private final ServerRepository serverRepository;

    /**
     * Submit a new request log from the agent
     */
    public RequestLogResponse submitRequestLog(RequestLogSubmitRequest request) {
        log.info("Submitting request log - Server: {}, Client IP: {}, Method: {}, URL: {}",
                request.getServerId(), request.getClientIP(), request.getMethod(), request.getUrl());

        // Verify server exists
        Server server = serverRepository.findById(request.getServerId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Server not found with ID: " + request.getServerId()));

        // Create and save request log
        RequestLog requestLog = RequestLog.builder()
                .server(server)
                .clientIP(request.getClientIP())
                .method(request.getMethod())
                .url(request.getUrl())
                .statusCode(request.getStatusCode())
                .build();

        RequestLog savedLog = requestLogRepository.save(requestLog);
        log.info("Request log saved successfully - ID: {}", savedLog.getId());

        return mapToResponse(savedLog);
    }

    /**
     * Get paginated request logs for a specific server
     */
    public Page<RequestLogResponse> getRequestLogsByServer(Long serverId, Pageable pageable) {
        return requestLogRepository.findByServerId(serverId, pageable)
                .map(this::mapToResponse);
    }

    /**
     * Get recent request logs for a server (latest first)
     */
    public List<RequestLogResponse> getRecentRequestLogs(Long serverId, int limit) {
        List<RequestLog> logs = requestLogRepository.findByServerIdOrderByTimestampDesc(serverId);
        return logs.stream()
                .limit(limit)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get request logs by client IP address
     */
    public Page<RequestLogResponse> getRequestLogsByClientIP(String clientIP, Pageable pageable) {
        return requestLogRepository.findByClientIP(clientIP, pageable)
                .map(this::mapToResponse);
    }

    /**
     * Get request logs for a server by specific client IP
     */
    public Page<RequestLogResponse> getRequestLogsByServerAndClientIP(Long serverId, String clientIP, Pageable pageable) {
        return requestLogRepository.findByServerIdAndClientIP(serverId, clientIP, pageable)
                .map(this::mapToResponse);
    }

    /**
     * Get request logs by HTTP method
     */
    public Page<RequestLogResponse> getRequestLogsByMethod(String method, Pageable pageable) {
        return requestLogRepository.findByMethod(method, pageable)
                .map(this::mapToResponse);
    }

    /**
     * Get request logs for a server within a time range
     */
    public List<RequestLogResponse> getRequestLogsByTimeRange(Long serverId, LocalDateTime startTime, LocalDateTime endTime) {
        return requestLogRepository.findByServerIdAndTimestampBetween(serverId, startTime, endTime)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get request logs by status code
     */
    public Page<RequestLogResponse> getRequestLogsByStatusCode(Long serverId, Integer statusCode, Pageable pageable) {
        return requestLogRepository.findByServerIdAndStatusCode(serverId, statusCode, pageable)
                .map(this::mapToResponse);
    }

    /**
     * Get request count for a server in the last N minutes
     */
    public Integer getRequestCountInLastNMinutes(Long serverId, int minutes) {
        LocalDateTime startTime = LocalDateTime.now().minusMinutes(minutes);
        return requestLogRepository.countRequestsInTimeRange(serverId, startTime);
    }

    /**
     * Get all unique client IPs for a server
     */
    public List<String> getUniqueClientIPsByServer(Long serverId) {
        return requestLogRepository.findDistinctClientIPsByServerId(serverId);
    }

    /**
     * Get a single request log by ID
     */
    public RequestLogResponse getRequestLogById(Long id) {
        RequestLog requestLog = requestLogRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Request log not found with ID: " + id));
        return mapToResponse(requestLog);
    }

    /**
     * Map RequestLog entity to response DTO
     */
    private RequestLogResponse mapToResponse(RequestLog requestLog) {
        return RequestLogResponse.builder()
                .id(requestLog.getId())
                .timestamp(requestLog.getTimestamp())
                .serverId(requestLog.getServer().getId())
                .clientIP(requestLog.getClientIP())
                .method(requestLog.getMethod())
                .url(requestLog.getUrl())
                .statusCode(requestLog.getStatusCode())
                .build();
    }
}
