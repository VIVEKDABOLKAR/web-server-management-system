package com.wsms.dto.metric;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MetricResponse {
    private Long id;
    private Double cpuUsage;
    private Double loadAvg1m;
    private Double memoryUsage;
    private Double diskUsage;
    private Double diskReadPerSec;
    private Double diskWritePerSec;
    private Double networkTraffic;
    private Integer runningProcesses;
    private Integer sleepingProcesses;
    private Integer blockedProcesses;
    private Integer totalProcesses;
    private Integer requestCount;
    private LocalDateTime createdAt;
    private Long serverId;
    private String serverName;
    private String serverStatus;
}
