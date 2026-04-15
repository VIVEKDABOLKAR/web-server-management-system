package com.wsms.service.interfaces;

public interface MetricCleanupServiceInterface {

    void cleanupOldMetrics();

    int cleanupMetricsOlderThan(int days);
}
