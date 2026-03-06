package com.wsms.service;

import com.wsms.dto.server.AddServerRequest;
import com.wsms.entity.Server;
import com.wsms.entity.ServerStatus;
import com.wsms.entity.User;
import com.wsms.repository.ServerRepository;
import com.wsms.repository.UserRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ServerService {

    private final ServerRepository serverRepository;
    private final UserRepository userRepository;

    @Transactional
    public Server addServer(AddServerRequest dto, Long userId) {
        if (serverRepository.existsByIpAddress(dto.getIpAddress())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Server with this IP already exists");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Server server = Server.builder()
                .serverName(dto.getServerName())
                .ipAddress(dto.getIpAddress())
                .osType(dto.getOsType())
                .webServerType(dto.getWebServerType())
                .description(dto.getDescription())
                .status(ServerStatus.INACTIVE)
                .agentToken(UUID.randomUUID().toString())
                .user(user)
                .build();

        return serverRepository.save(server);
    }

    @Transactional(readOnly = true)
    public List<Server> getAllServersByUser(Long userId) {
        return serverRepository.findAllByUserId(userId);
    }

    @Transactional(readOnly = true)
    public Server getServerById(Long serverId) {
        return serverRepository.findById(serverId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Server not found"));
    }

    @Transactional(readOnly = true)
    public Server getServerByIdForUser(Long serverId, Long userId) {
        return serverRepository.findByIdAndUserId(serverId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Server not found"));
    }

    @Transactional
    public void deleteServer(Long serverId, Long userId) {
        Server server = getServerByIdForUser(serverId, userId);
        serverRepository.delete(server);
    }
}
