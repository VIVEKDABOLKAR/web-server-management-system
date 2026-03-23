package com.wsms.controller;

import com.wsms.dto.server.AddServerRequest;
import com.wsms.dto.server.ServerResponse;
import com.wsms.entity.*;
import com.wsms.service.ServerService;
import com.wsms.service.UserService;
import com.wsms.utils.installScript.InstallScript;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/servers")
@RequiredArgsConstructor
public class ServerController {

    private final ServerService serverService;
    //removed user Repository
    private  final UserService  userService;
    private final InstallScript installScript;

    @Value("${app.backend.url}")
    private String backendUrl;

    /**
     * endpoint :- Post /api/servers/
     * req :- server request (AddServerRequest DTO)
     * res :- server object
     * desc :- create server object
     * take userId from authorization object
     *
     */
    @PostMapping
    public ResponseEntity<ServerResponse> addServer(@Valid @RequestBody AddServerRequest request) {
        Long userId = getLoggedInUserId();
        Server savedServer = serverService.addServer(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(savedServer));
    }

    /**
     * endpoint :- Get /api/servers/
     * req :-
     * res :- List server object
     * desc :- fetch all the server for the user id - fetch from authorization
     * object
     */
    @GetMapping
    public ResponseEntity<List<ServerResponse>> getAllServersByLoggedInUser() {
        Long userId = getLoggedInUserId();
        List<ServerResponse> servers = serverService.getAllServersByUser(userId)
                .stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(servers);
    }

    /**
     * endpoint :- Get /api/servers/{id}
     * req :- server id
     * res :- server object
     * desc :- get server object based on server id and user id
     */
    @GetMapping("/{id}")
    public ResponseEntity<ServerResponse> getServer(@PathVariable("id") Long serverId) {
        Long userId = getLoggedInUserId();
        Server server = serverService.getServerByIdForUser(serverId, userId);
        return ResponseEntity.ok(toResponse(server));
    }

    // ignore the endpoint - need to work on system design first
    @GetMapping(value = "/{id}/install-script", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> getInstallScript(@PathVariable("id") Long serverId) {
        Long userId = getLoggedInUserId();
        Server server = serverService.getServerByIdForUser(serverId, userId);

        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_PLAIN)
            .body(installScript.generateScriptAndUpload(server, backendUrl));
    }

    /**
     * endpoint :- Delete /api/servers/{id}
     * req :- server id
     * res :- void -
     * desc :- delete server object based on id and userId
     *
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteServer(@PathVariable("id") Long serverId) {
        Long userId = getLoggedInUserId();
        serverService.deleteServer(serverId, userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * return user Id based on the authentication object user email
     *
     * @return
     */
    private Long getLoggedInUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getCurrentUser();

        return user.getId();
    }

    /**
     * private method to create server Response based on the server object
     */
    private ServerResponse toResponse(Server server) {
        ServerStatus effectiveStatus = server.getStatus();
        // wrong check server status is not depended on blockIps no of rows

        return ServerResponse.builder()
                .id(server.getId())
                .serverName(server.getServerName())
                .ipAddress(server.getIpAddress())
                .osType(server.getOsType())
                .webServerType(server.getWebServerType())
                .webServerPortNo(server.getWebServerPortNo())
                .status(effectiveStatus)
                .agentToken(server.getAgentToken())
                .description(server.getDescription())
                .createdAt(server.getCreatedAt())
                .updatedAt(server.getUpdatedAt())
                .userId(server.getUser().getId())
                .lastHeartbeat(server.getLastHeartbeat())
                .build();
    }


}
