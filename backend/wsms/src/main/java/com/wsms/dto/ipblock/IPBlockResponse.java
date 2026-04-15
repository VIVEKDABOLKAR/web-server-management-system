package com.wsms.dto.ipblock;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class IPBlockResponse {

    private Long id;

    private Long serverId;

    private String clientIp;

    private String status="UNBLOCK";

    private LocalDateTime lastRequest;
}


