package com.wsms.controller;

import com.wsms.dto.server.AddServerRequest;
import com.wsms.dto.server.ServerResponse;
import com.wsms.entity.Server;
import com.wsms.entity.ServerStatus;
import com.wsms.entity.User;
import com.wsms.repository.UserRepository;
import com.wsms.service.ServerService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/servers")
@RequiredArgsConstructor
public class ServerController {

    private final ServerService serverService;
    private final UserRepository userRepository;

    @Value("${app.backend.url:http://localhost:8080}")
    private String backendUrl;

    @PostMapping
    public ResponseEntity<ServerResponse> addServer(@Valid @RequestBody AddServerRequest request) {
        Long userId = getLoggedInUserId();
        Server savedServer = serverService.addServer(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(savedServer));
    }

    @GetMapping
    public ResponseEntity<List<ServerResponse>> getAllServersByLoggedInUser() {
        Long userId = getLoggedInUserId();
        List<ServerResponse> servers = serverService.getAllServersByUser(userId)
                .stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(servers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServerResponse> getServer(@PathVariable("id") Long serverId) {
        Long userId = getLoggedInUserId();
        Server server = serverService.getServerByIdForUser(serverId, userId);
        return ResponseEntity.ok(toResponse(server));
    }

    @GetMapping(value = "/{id}/install-script", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> getInstallScript(@PathVariable("id") Long serverId) {
        Long userId = getLoggedInUserId();
        Server server = serverService.getServerByIdForUser(serverId, userId);

        String script = """
                #!/bin/bash
                set -e

                SERVER_ID="%s"
                AGENT_TOKEN="%s"
                BACKEND_URL="%s"

                echo "Installing WSMS agent for server $SERVER_ID"
                curl -fsSL "$BACKEND_URL/api/agent/install.sh" -o wsms-agent-install.sh
                chmod +x wsms-agent-install.sh
                ./wsms-agent-install.sh "$SERVER_ID" "$AGENT_TOKEN" "$BACKEND_URL"
                """.formatted(server.getId(), server.getAgentToken(), backendUrl);

        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_PLAIN)
                .body(script);
    }

    private Long getLoggedInUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Logged in user not found"));

        return user.getId();
    }

    private ServerResponse toResponse(Server server) {
        ServerStatus effectiveStatus = server.getStatus();
        if (server.getBlockedIps() != null && !server.getBlockedIps().isEmpty()) {
            effectiveStatus = ServerStatus.BLOCKED;
        }

        return ServerResponse.builder()
                .id(server.getId())
                .serverName(server.getServerName())
                .ipAddress(server.getIpAddress())
                .osType(server.getOsType())
                .webServerType(server.getWebServerType())
                .status(effectiveStatus)
                .agentToken(server.getAgentToken())
                .description(server.getDescription())
                .createdAt(server.getCreatedAt())
                .updatedAt(server.getUpdatedAt())
                .userId(server.getUser().getId())
                .build();
    }
}
