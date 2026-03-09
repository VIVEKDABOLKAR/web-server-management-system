package com.wsms.controller;

import com.wsms.dto.alert.AlertResponse;
import com.wsms.entity.Alert;
import com.wsms.entity.User;
import com.wsms.repository.AlertRepository;
import com.wsms.repository.UserRepository;
import com.wsms.service.ServerService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertRepository alertRepository;
    private final ServerService serverService;
    private final UserRepository userRepository;

    @GetMapping("/server/{id}")
    public ResponseEntity<List<AlertResponse>> getAlertsByServer(@PathVariable("id") Long serverId) {
        Long userId = getLoggedInUserId();
        serverService.getServerByIdForUser(serverId, userId);

        List<AlertResponse> alerts = alertRepository.findAllByServerIdOrderByCreatedAtDesc(serverId)
                .stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(alerts);
    }

    private Long getLoggedInUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Logged in user not found"));
        return user.getId();
    }

    private AlertResponse toResponse(Alert alert) {
        return AlertResponse.builder()
                .id(alert.getId())
                .serverId(alert.getServer().getId())
                .alertType(alert.getAlertType())
                .message(alert.getMessage())
                .status(alert.getStatus())
                .createdAt(alert.getCreatedAt())
                .build();
    }
}
