package com.wsms.dto.metric;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MetricResponse {
    private Long id;
    private Double cpuUsage;
    private Double memoryUsage;
    private Double diskUsage;
    private Long requestCount;
    private String serverStatus;
    private LocalDateTime createdAt;
    private Long serverId;
    private String serverName;
}
