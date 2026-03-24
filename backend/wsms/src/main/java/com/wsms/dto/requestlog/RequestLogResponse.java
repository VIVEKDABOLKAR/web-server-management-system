package com.wsms.dto.requestlog;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestLogResponse {

    private Long id;

    private LocalDateTime timestamp;

    private Long serverId;

    private String clientIP;

    private String method;

    private String url;

    private Integer port;

    private Integer statusCode;
}
