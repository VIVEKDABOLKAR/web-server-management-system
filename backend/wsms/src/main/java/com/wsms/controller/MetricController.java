package com.wsms.controller;

import com.wsms.dto.metric.MetricResponse;
import com.wsms.entity.User;
import com.wsms.repository.UserRepository;
import com.wsms.service.MetricService;
import com.wsms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metrics")
@RequiredArgsConstructor
public class MetricController {

    private final MetricService metricService;
    //remove userRepository to userService
    private final UserService userService;

    @GetMapping("/server/{serverId}")
    public ResponseEntity<List<MetricResponse>> getMetricsByServer(
            @PathVariable("serverId") Long serverId) {
        Long userId = getLoggedInUserId();
        String role = getLoggedInUserRole();
        List<MetricResponse> metrics;
        if ("ADMIN".equalsIgnoreCase(role)) {
            metrics = metricService.getMetricsByServer(serverId, null); // null or special handling for admin
        } else {
            metrics = metricService.getMetricsByServer(serverId, userId);
        }
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/server/{serverId}/recent")
    public ResponseEntity<List<MetricResponse>> getRecentMetrics(
            @PathVariable("serverId") Long serverId,
            @RequestParam(value = "hours", defaultValue = "24") int hours) {
        Long userId = getLoggedInUserId();
        String role = getLoggedInUserRole();
        List<MetricResponse> metrics;
        if ("ADMIN".equalsIgnoreCase(role)) {
            metrics = metricService.getRecentMetricsByServer(serverId, hours, null); // null or special handling for admin
        } else {
            metrics = metricService.getRecentMetricsByServer(serverId, hours, userId);
        }
        return ResponseEntity.ok(metrics);
    }
    //get current user role
    public String getLoggedInUserRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getAuthorities() != null) {
            return authentication.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .filter(role -> role.startsWith("ROLE_"))
                .map(role -> role.substring(5)) // Remove "ROLE_" prefix
                .findFirst()
                .orElse("USER");
        }
        return "USER";
    }

    private Long getLoggedInUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User user = userService.getCurrentUser();
        
        return user.getId();
    }
}
