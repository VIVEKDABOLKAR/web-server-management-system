package com.wsms.controller;

import com.wsms.dto.requestlog.RequestLogResponse;
import com.wsms.service.RequestLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/request-logs")
@RequiredArgsConstructor
public class RequestLogController {

    private final RequestLogService requestLogService;

    /**
     * Get paginated request logs for a specific server
     */
    @GetMapping("/server/{serverId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<RequestLogResponse>> getRequestLogsByServer(
            @PathVariable Long serverId,
            Pageable pageable) {
        log.info("Fetching request logs for server ID: {}", serverId);
        return ResponseEntity.ok(requestLogService.getRequestLogsByServer(serverId, pageable));
    }

    /**
     * Get recent request logs for a server (latest first)
     */
    @GetMapping("/server/{serverId}/recent")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<RequestLogResponse>> getRecentRequestLogs(
            @PathVariable Long serverId,
            @RequestParam(defaultValue = "50") int limit) {
        log.info("Fetching {} recent request logs for server ID: {}", limit, serverId);
        return ResponseEntity.ok(requestLogService.getRecentRequestLogs(serverId, limit));
    }

    /**
     * Get request logs by client IP address
     */
    @GetMapping("/client-ip/{clientIP}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<RequestLogResponse>> getRequestLogsByClientIP(
            @PathVariable String clientIP,
            Pageable pageable) {
        log.info("Fetching request logs for client IP: {}", clientIP);
        return ResponseEntity.ok(requestLogService.getRequestLogsByClientIP(clientIP, pageable));
    }

    /**
     * Get request logs for a server by specific client IP
     */
    @GetMapping("/server/{serverId}/client-ip/{clientIP}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<RequestLogResponse>> getRequestLogsByServerAndClientIP(
            @PathVariable Long serverId,
            @PathVariable String clientIP,
            Pageable pageable) {
        log.info("Fetching request logs for server ID: {} and client IP: {}", serverId, clientIP);
        return ResponseEntity.ok(requestLogService.getRequestLogsByServerAndClientIP(serverId, clientIP, pageable));
    }

    /**
     * Get request logs by HTTP method
     */
    @GetMapping("/method/{method}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<RequestLogResponse>> getRequestLogsByMethod(
            @PathVariable String method,
            Pageable pageable) {
        log.info("Fetching request logs for method: {}", method);
        return ResponseEntity.ok(requestLogService.getRequestLogsByMethod(method, pageable));
    }

    /**
     * Get request logs by status code
     */
    @GetMapping("/server/{serverId}/status/{statusCode}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<RequestLogResponse>> getRequestLogsByStatusCode(
            @PathVariable Long serverId,
            @PathVariable Integer statusCode,
            Pageable pageable) {
        log.info("Fetching request logs for server ID: {} with status code: {}", serverId, statusCode);
        return ResponseEntity.ok(requestLogService.getRequestLogsByStatusCode(serverId, statusCode, pageable));
    }

    /**
     * Get request count for a server in the last N minutes
     */
    @GetMapping("/server/{serverId}/count-last-minutes")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Integer> getRequestCountInLastNMinutes(
            @PathVariable Long serverId,
            @RequestParam(defaultValue = "5") int minutes) {
        log.info("Fetching request count for server ID: {} in last {} minutes", serverId, minutes);
        Integer count = requestLogService.getRequestCountInLastNMinutes(serverId, minutes);
        return ResponseEntity.ok(count);
    }

    /**
     * Get all unique client IPs for a server
     */
    @GetMapping("/server/{serverId}/unique-ips")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<String>> getUniqueClientIPsByServer(@PathVariable Long serverId) {
        log.info("Fetching unique client IPs for server ID: {}", serverId);
        return ResponseEntity.ok(requestLogService.getUniqueClientIPsByServer(serverId));
    }

    /**
     * Get a single request log by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<RequestLogResponse> getRequestLogById(@PathVariable Long id) {
        log.info("Fetching request log with ID: {}", id);
        return ResponseEntity.ok(requestLogService.getRequestLogById(id));
    }
}
