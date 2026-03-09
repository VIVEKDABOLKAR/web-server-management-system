package com.wsms.dto.server;

import com.wsms.entity.OSType;
import com.wsms.entity.ServerStatus;
import com.wsms.entity.WebServerType;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ServerResponse {

    private Long id;
    private String serverName;
    private String ipAddress;
    private OSType osType;
    private WebServerType webServerType;
    private ServerStatus status;
    private String agentToken;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long userId;
}
