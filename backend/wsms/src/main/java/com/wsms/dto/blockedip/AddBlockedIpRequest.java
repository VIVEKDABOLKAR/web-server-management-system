package com.wsms.dto.blockedip;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddBlockedIpRequest {

    @NotNull
    private Long serverId;

    @NotBlank
    @Pattern(
            regexp = "^((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)$",
            message = "ipAddress must be a valid IPv4 address"
    )
    private String ipAddress;

    @Size(max = 500)
    private String reason;
}
