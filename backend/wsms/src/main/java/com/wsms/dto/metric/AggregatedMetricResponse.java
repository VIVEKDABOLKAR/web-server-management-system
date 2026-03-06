package com.wsms.dto.metric;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
public class AggregatedMetricResponse {
    private LocalDateTime period;
    private Double avgCpuUsage;
    private Double avgMemoryUsage;
    private Double avgDiskUsage;
    private Double maxCpuUsage;
    private Double maxMemoryUsage;
    private Double maxDiskUsage;
    private Long totalRequestCount;
    private Integer dataPointCount;

    // Constructor for JPQL query projection
    public AggregatedMetricResponse(
            LocalDateTime period,
            Double avgCpuUsage,
            Double avgMemoryUsage,
            Double avgDiskUsage,
            Double maxCpuUsage,
            Double maxMemoryUsage,
            Double maxDiskUsage,
            Long totalRequestCount,
            Integer dataPointCount) {
        this.period = period;
        this.avgCpuUsage = avgCpuUsage;
        this.avgMemoryUsage = avgMemoryUsage;
        this.avgDiskUsage = avgDiskUsage;
        this.maxCpuUsage = maxCpuUsage;
        this.maxMemoryUsage = maxMemoryUsage;
        this.maxDiskUsage = maxDiskUsage;
        this.totalRequestCount = totalRequestCount;
        this.dataPointCount = dataPointCount;
    }
}
