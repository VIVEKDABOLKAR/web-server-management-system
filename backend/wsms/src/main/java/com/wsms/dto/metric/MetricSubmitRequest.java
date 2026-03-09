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
    
    @NotNull(message = "Memory usage is required")
    private Double memoryUsage;
    
    private Double diskUsage;
    
    private Long requestCount;
    
    private String timestamp;
}
