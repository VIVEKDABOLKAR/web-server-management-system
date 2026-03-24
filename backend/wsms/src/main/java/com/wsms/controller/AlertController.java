package com.wsms.controller;

import com.wsms.dto.alert.AlertResponse;
import com.wsms.entity.Alert;
import com.wsms.entity.Server;
import com.wsms.entity.User;
import com.wsms.service.AlertService;
import com.wsms.service.ServerService;

import java.util.ArrayList;
import java.util.List;

import com.wsms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wsms.dto.alert.AlertResponse;
import com.wsms.entity.Alert;
import com.wsms.entity.Server;
import com.wsms.entity.User;
import com.wsms.service.AlertService;
import com.wsms.service.ServerService;
import com.wsms.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    //remove alertRepository and UserRepository
    //added UserService and AlertService
    private final ServerService serverService;
    private final UserService userService;
    private  final AlertService alertService;


    /**
     * it fetches all the alert based on the server_id
     * @param serverId
     * @return list of alert
     */
    @GetMapping("/server/{id}")
    public ResponseEntity<List<AlertResponse>> getAlertsByServer(@PathVariable("id") Long serverId) {
        //get current user id
        Long userId = getLoggedInUserId();
        String role = getLoggedInUserRole();

        Server server;
        if ("ADMIN".equalsIgnoreCase(role)) {
            server = serverService.getServerById(serverId); // Admin can access any server
        } else {
            server = serverService.getServerByIdForUser(serverId, userId); // User can access only their own
        }

        if (server == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        //fetch all alert based in serverId
        List<Alert> alerts = alertService.findAllByServerIdOrderByCreatedAtDesc(server);
        System.out.println(alerts.toString());
          List<AlertResponse> alertResponses =alerts.stream()
                .map(this::toResponse)
                .toList();
        System.out.println(alerts.toString());
        return ResponseEntity.ok(alertResponses);
    }
    //get current user role
    public String getLoggedInUserRole() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && authentication.getAuthorities() != null) {
        return authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .filter(role -> role.startsWith("ROLE_"))
            .map(role -> role.substring(5)) // Remove "ROLE_" prefix
            .findFirst()
            .orElse("USER");
    }
    return "USER";
}

    //get current userId
    private Long getLoggedInUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userService.getCurrentUser();
        return user.getId();
    }

    /**
     * convert ALert object into AlertResponse DTO
     * @param alert
     * @return
     */
    private AlertResponse toResponse(Alert alert) {
        return AlertResponse.builder()
                .id(alert.getId())
                .alertType(alert.getAlertType())
                .serverId(alert.getServer().getId())
                .serverName(alert.getServer().getServerName())
                .message(alert.getMessage())
                .status(alert.getStatus())
                .createdAt(alert.getCreatedAt())
                .value(alert.getValue())
                .threshold(alert.getThreshold())
                .build();
    }

    @GetMapping("")
    public ResponseEntity<List<AlertResponse>> fetchAllAlerts() {
        User user = userService.getCurrentUser();
        List<Server> servers = serverService.getAllServersByUser(user.getId());
        if (servers == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        List<AlertResponse> allAlerts = new ArrayList<>();
        for (Server server : servers) {
            List<Alert> alerts = alertService.findAllByServerIdOrderByCreatedAtDesc(server);
            System.out.println(alerts.toString());
            if (alerts != null) {
                allAlerts.addAll(
                        alerts.stream()
                                .map(this::toResponse)
                                .toList()
                );
            }
        }
        return ResponseEntity.ok(allAlerts);
    }
}
