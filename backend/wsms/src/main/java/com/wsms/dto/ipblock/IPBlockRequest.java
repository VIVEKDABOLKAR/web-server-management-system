package com.wsms.dto.ipblock;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IPBlockRequest {

    @NotNull(message = "serverId is required")
    private Long serverId;

    @NotNull(message="clientIp is required")
    private String clientIp;
}
