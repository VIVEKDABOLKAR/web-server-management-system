package com.wsms.dto.server;

import com.wsms.entity.OSType;
import com.wsms.entity.WebServerType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddServerRequest {

    @NotBlank
    private String serverName;

    @NotBlank
    @Pattern(
            regexp = "^((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)$",
            message = "ipAddress must be a valid IPv4 address"
    )
    private String ipAddress;

    @NotNull
    private OSType osType;

    @NotNull
    private WebServerType webServerType;

    @NotNull
    private Integer webServerPortNo;

    private String description;
}
