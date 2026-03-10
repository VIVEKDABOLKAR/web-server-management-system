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
        List<MetricResponse> metrics = metricService.getMetricsByServer(serverId, userId);
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/server/{serverId}/recent")
    public ResponseEntity<List<MetricResponse>> getRecentMetrics(
            @PathVariable("serverId") Long serverId,
            @RequestParam(value = "hours", defaultValue = "24") int hours) {
        Long userId = getLoggedInUserId();
        List<MetricResponse> metrics = metricService.getRecentMetricsByServer(serverId, hours, userId);
        return ResponseEntity.ok(metrics);
    }

    private Long getLoggedInUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User user = userService.getCurrentUser();
        
        return user.getId();
    }
}
