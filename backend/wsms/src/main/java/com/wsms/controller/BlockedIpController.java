package com.wsms.controller;

import com.wsms.dto.blockedip.AddBlockedIpRequest;
import com.wsms.dto.blockedip.BlockedIpResponse;
import com.wsms.entity.BlockedIp;
import com.wsms.entity.Server;
import com.wsms.entity.User;
import com.wsms.repository.BlockedIpRepository;
import com.wsms.repository.UserRepository;
import com.wsms.service.ServerService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/blocked-ips")
@RequiredArgsConstructor
public class BlockedIpController {

    private final BlockedIpRepository blockedIpRepository;
    private final ServerService serverService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<BlockedIpResponse> blockIp(@Valid @RequestBody AddBlockedIpRequest request) {
        Long userId = getLoggedInUserId();
        String role = getLoggedInUserRole();
        Server server;
        if ("ADMIN".equalsIgnoreCase(role)) {
            server = serverService.getServerById(request.getServerId());
        } else {
            server = serverService.getServerByIdForUser(request.getServerId(), userId);
        }

        if (server == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Server not found");
        }

        if (blockedIpRepository.existsByServerIdAndIpAddress(request.getServerId(), request.getIpAddress())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "IP already blocked for this server");
        }

        BlockedIp blockedIp = BlockedIp.builder()
                .server(server)
                .ipAddress(request.getIpAddress())
                .reason(request.getReason())
                .build();

        BlockedIp saved = blockedIpRepository.save(blockedIp);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
    }

    @GetMapping("/server/{id}")
    public ResponseEntity<List<BlockedIpResponse>> getBlockedIpsByServer(@PathVariable("id") Long serverId) {
        Long userId = getLoggedInUserId();
        String role = getLoggedInUserRole();
        Server server;
        if ("ADMIN".equalsIgnoreCase(role)) {
            server = serverService.getServerById(serverId);
        } else {
            server = serverService.getServerByIdForUser(serverId, userId);
        }

        if (server == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Server not found");
        }

        List<BlockedIpResponse> blockedIps = blockedIpRepository.findAllByServerIdOrderByCreatedAtDesc(serverId)
                .stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(blockedIps);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> unblockIp(@PathVariable("id") Long blockedIpId) {
        Long userId = getLoggedInUserId();
        String role = getLoggedInUserRole();
        BlockedIp blockedIp;
        if ("ADMIN".equalsIgnoreCase(role)) {
            blockedIp = blockedIpRepository.findById(blockedIpId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Blocked IP not found"));
        } else {
            blockedIp = blockedIpRepository.findByIdAndServerUserId(blockedIpId, userId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Blocked IP not found"));
        }

        blockedIpRepository.delete(blockedIp);
        return ResponseEntity.noContent().build();
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

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Logged in user not found"));
        return user.getId();
    }

    private BlockedIpResponse toResponse(BlockedIp blockedIp) {
        return BlockedIpResponse.builder()
                .id(blockedIp.getId())
                .serverId(blockedIp.getServer().getId())
                .ipAddress(blockedIp.getIpAddress())
                .reason(blockedIp.getReason())
                .blockedAt(blockedIp.getCreatedAt())
                .createdAt(blockedIp.getCreatedAt())
                .build();
    }
}
