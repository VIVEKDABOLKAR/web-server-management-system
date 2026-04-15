package com.wsms.service;

import com.wsms.repository.MetricRepository;
import com.wsms.service.interfaces.MetricCleanupServiceInterface;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class MetricCleanupService implements MetricCleanupServiceInterface {

    private final MetricRepository metricRepository;

    @Value("${app.metrics.retention-days:30}")
    private int retentionDays;

    /**
     * Runs daily at 2:00 AM to clean up old metrics
     * Cron: second, minute, hour, day, month, weekday
     */
    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void cleanupOldMetrics() {
        log.info("Starting scheduled metric cleanup...");
        
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(retentionDays);
        
        try {
            int deletedCount = metricRepository.deleteByCreatedAtBefore(cutoffDate);
            log.info("✓ Cleanup completed. Deleted {} old metrics (older than {} days)", 
                    deletedCount, retentionDays);
        } catch (Exception ex) {
            log.error("✗ Failed to cleanup old metrics: {}", ex.getMessage(), ex);
        }
    }

    /**
     * Manual cleanup method that can be called via API
     */
    @Transactional
    public int cleanupMetricsOlderThan(int days) {
        log.info("Manual cleanup requested for metrics older than {} days", days);
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(days);
        int deletedCount = metricRepository.deleteByCreatedAtBefore(cutoffDate);
        log.info("Manual cleanup completed. Deleted {} metrics", deletedCount);
        return deletedCount;
    }
}
