package com.wsms.repository;

import com.wsms.entity.RequestLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RequestLogRepository extends JpaRepository<RequestLog, Long> {

    /**
     * Find all request logs for a specific server
     */
    Page<RequestLog> findByServerId(Long serverId, Pageable pageable);

    /**
     * Find request logs by server ID sorted by timestamp (newest first)
     */
    List<RequestLog> findByServerIdOrderByTimestampDesc(Long serverId);

    /**
     * Find request logs by client IP address
     */
    Page<RequestLog> findByClientIP(String clientIP, Pageable pageable);

    /**
     * Find request logs by server ID and client IP
     */
    Page<RequestLog> findByServerIdAndClientIP(Long serverId, String clientIP, Pageable pageable);

    /**
     * Find request logs by HTTP method
     */
    Page<RequestLog> findByMethod(String method, Pageable pageable);

    /**
     * Find request logs for a server within a time range
     */
    @Query("SELECT r FROM RequestLog r WHERE r.server.id = :serverId AND r.timestamp BETWEEN :startTime AND :endTime ORDER BY r.timestamp DESC")
    List<RequestLog> findByServerIdAndTimestampBetween(
            @Param("serverId") Long serverId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);

    /**
     * Find request logs by server and status code
     */
    Page<RequestLog> findByServerIdAndStatusCode(Long serverId, Integer statusCode, Pageable pageable);

    /**
     * Count request logs by server for the last N minutes
     */
    @Query("SELECT COUNT(r) FROM RequestLog r WHERE r.server.id = :serverId AND r.timestamp >= :startTime")
    Integer countRequestsInTimeRange(
            @Param("serverId") Long serverId,
            @Param("startTime") LocalDateTime startTime);

    /**
     * Find unique client IPs for a server
     */
    @Query("SELECT DISTINCT r.clientIP FROM RequestLog r WHERE r.server.id = :serverId ORDER BY r.clientIP")
    List<String> findDistinctClientIPsByServerId(@Param("serverId") Long serverId);
}
