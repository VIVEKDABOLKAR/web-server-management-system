package com.wsms.dto.alert;

import com.wsms.entity.AlertStatus;
import com.wsms.entity.AlertType;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AlertResponse {
    private Long id;
    private Long serverId;
    private AlertType alertType;
    private String message;
    private AlertStatus status;
    private LocalDateTime createdAt;
}
