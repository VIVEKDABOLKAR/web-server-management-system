package com.wsms.controller;

import com.wsms.dto.alert.AlertResponse;
import com.wsms.entity.Alert;
import com.wsms.entity.Server;
import com.wsms.entity.User;
import com.wsms.service.AlertService;
import com.wsms.service.ServerService;
import java.util.List;

import com.wsms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

        //get the server object
        Server server = serverService.getServerByIdForUser(serverId, userId);

        //valid if server exists
        if(server == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        //fetch all alert based in serverId
        List<AlertResponse> alerts = alertService.findAllByServerIdOrderByCreatedAtDesc(server)
                .stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(alerts);
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
                .serverId(alert.getServer().getId())
                .alertType(alert.getAlertType())
                .message(alert.getMessage())
                .status(alert.getStatus())
                .createdAt(alert.getCreatedAt())
                .build();
    }
}
