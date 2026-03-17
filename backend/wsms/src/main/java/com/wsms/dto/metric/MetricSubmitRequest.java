package com.wsms.dto.metric;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MetricSubmitRequest {

    @NotNull(message = "Server ID is required")
    private Long serverId;

    @NotNull(message = "CPU usage is required")
    private Double cpuUsage;

    @NotNull(message = "Load Avg (1m) is required")
    private Double loadAvg1m;

    @NotNull(message = "Memory usage is required")
    private Double memoryUsage;

    @NotNull(message = "Disk usage is required")
    private Double diskUsage;

    @NotNull(message = "Disk Reads/s is required")
    private Double diskReadPerSec;

    @NotNull(message = "Disk Writes/s is required")
    private Double diskWritePerSec;

    @NotNull(message = "Network Traffic is required")
    private Double networkTraffic;

    @NotNull(message = "Running Processes is required")
    private Integer runningProcesses;

    @NotNull(message = "Sleeping Processes is required")
    private Integer sleepingProcesses;

    @NotNull(message = "Blocked Processes is required")
    private Integer blockedProcesses;

    @NotNull(message = "Total Processes is required")
    private Integer totalProcesses;

    @NotNull(message = "Timestamp is required")
    private String timestamp;
}
