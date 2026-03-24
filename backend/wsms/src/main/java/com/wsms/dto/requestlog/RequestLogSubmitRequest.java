package com.wsms.dto.requestlog;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestLogSubmitRequest {

    @NotNull(message = "Server ID is required")
    private Long serverId;

    @NotBlank(message = "Client IP is required")
    private String clientIP;

    @NotBlank(message = "HTTP method is required")
    private String method;

    @NotBlank(message = "Request URL is required")
    private String url;

    private Integer statusCode;

    private String timestamp;
}
