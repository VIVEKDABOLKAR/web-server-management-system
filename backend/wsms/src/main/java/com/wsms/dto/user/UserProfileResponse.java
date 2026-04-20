package com.wsms.dto.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.wsms.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String fullName;
    private String userName; // add username field
    private String email;
    private UserRole role;
    private LocalDateTime createdAt;
    @JsonProperty("isVerified")
    private boolean isVerified;
    private int totalServers;
    private int activeServers;
    private int totalAlerts;
}
