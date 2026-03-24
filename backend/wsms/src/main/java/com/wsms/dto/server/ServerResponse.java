package com.wsms.dto.server;

import com.wsms.entity.OSType;
import com.wsms.entity.ServerStatus;

import java.time.LocalDateTime;

import com.wsms.entity.WebServerType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ServerResponse {
    private LocalDateTime lastHeartbeat;

    private Long id;
    private String serverName;
    private String ipAddress;
    private OSType osType;
    private WebServerType webServerType;
    private Integer webServerPortNo;
    private ServerStatus status;
    private String agentToken;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long userId;
}
