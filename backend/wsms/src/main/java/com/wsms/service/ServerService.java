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

    /**
     * add server to the db
     * @param dto
     * @param userId
     * @return
     */
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
                .webServerPortNo(dto.getWebServerPortNo())
                .description(dto.getDescription())
                .status(ServerStatus.INACTIVE) //we add machnisim to make it active :- based on agent installation and agen heartbeat response
                .agentToken(UUID.randomUUID().toString())
                .user(user)
                .build();

        return serverRepository.save(server);
    }

    /**
     * get all server based on the userId
     * @param userId
     * @return
     */
    @Transactional(readOnly = true)
    public List<Server> getAllServersByUser(Long userId) {
        return serverRepository.findAllByUserId(userId);
    }

    /**
     * get single server based on serverId
     * @param serverId
     * @return
     */
    @Transactional(readOnly = true)
    public Server getServerById(Long serverId) {
        return serverRepository.findById(serverId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Server not found"));
    }

    /**
     * get server object based on serverId and userId (it use to resolve duplicted serverId but unique userId)
     * @param serverId
     * @param userId
     * @return Server
     */
    @Transactional(readOnly = true)
    public Server getServerByIdForUser(Long serverId, Long userId) {
        return serverRepository.findByIdAndUserId(serverId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Server not found"));
    }

    /**
     * delete server from db
     * @param serverId
     * @param userId
     */
    @Transactional
    public void deleteServer(Long serverId, Long userId) {
        Server server = getServerByIdForUser(serverId, userId);
        serverRepository.delete(server);
    }
}
