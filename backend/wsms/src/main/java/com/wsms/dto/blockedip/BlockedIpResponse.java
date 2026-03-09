package com.wsms.dto.blockedip;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BlockedIpResponse {
    private Long id;
    private Long serverId;
    private String ipAddress;
    private String reason;
    private LocalDateTime blockedAt;
    private LocalDateTime createdAt;
}
