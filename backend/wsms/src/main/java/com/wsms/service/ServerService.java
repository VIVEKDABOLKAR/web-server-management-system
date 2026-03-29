package com.wsms.service;

import java.util.List;
import java.util.UUID;

import com.wsms.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.wsms.dto.server.AddServerRequest;
import com.wsms.entity.*;
import com.wsms.repository.OSTypeRepo;
import com.wsms.repository.ServerRepository;
import com.wsms.repository.UserRepository;

import com.wsms.repository.WebServerTypeRepo;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServerService {

    private final ServerRepository serverRepository;
    private final UserRepository userRepository;
    private final OSTypeRepo osTypeRepo;
    private final WebServerTypeRepo webServerTypeRepo;

    /**
     * add server to the db
     *
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

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        System.out.println("DTO userId: " + dto.getUserId());
        // ✅ If ADMIN + userId provided → override user
        if (isAdmin && dto.getUserId() != null) {
            user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Target user not found"
                    ));
        }
        OSType osType = osTypeRepo.findById(dto.getOsType().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "OS Type not found"));

        WebServerType webServerType = webServerTypeRepo.findById(dto.getWebServerType().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Web Server Type not found"));

        Server server = Server.builder()
                .serverName(dto.getServerName())
                .ipAddress(dto.getIpAddress())
                .osType(osType)
                .webServerType(webServerType)
                .webServerPortNo(dto.getWebServerPortNo())
                .description(dto.getDescription())
                .status(ServerStatus.INACTIVE) // we add machnisim to make it active :- based on agent installation and
                                               // agen heartbeat response
                .agentToken(UUID.randomUUID().toString())
                .user(user)
                .build();

        return serverRepository.save(server);
    }


    @Transactional
    public Server updateServer(Long id, AddServerRequest dto) {

        Server server = serverRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Server not found"));

        // optional: prevent duplicate IP
        if (!server.getIpAddress().equals(dto.getIpAddress()) &&
                serverRepository.existsByIpAddress(dto.getIpAddress())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Server with this IP already exists");
        }

        OSType osType = osTypeRepo.findById(dto.getOsType().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "OS Type not found"));

        WebServerType webServerType = webServerTypeRepo.findById(dto.getWebServerType().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Web Server Type not found"));

        // ✅ update fields
        server.setServerName(dto.getServerName());
        server.setIpAddress(dto.getIpAddress());
        server.setDescription(dto.getDescription());
        server.setWebServerPortNo(dto.getWebServerPortNo());
        server.setOsType(osType);
        server.setWebServerType(webServerType);

        return serverRepository.save(server);
    }

    /**
     * get all server based on the userId
     *
     * @param userId
     * @return
     */
    @Transactional(readOnly = true)
    public List<Server> getAllServersByUser(Long userId) {
        return serverRepository.findAllByUser_Id(userId);
    }

    /**
     * get single server based on serverId
     *
     * @param serverId
     * @return
     */
    @Transactional(readOnly = true)
    public Server getServerById(Long serverId) {
        return serverRepository.findById(serverId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Server not found"));
    }

    /**
     * get server object based on serverId and userId (it use to resolve duplicted
     * serverId but unique userId)
     * 
     * @param serverId
     * @param userId
     * @return Server
     */
    @Transactional(readOnly = true)
    public Server getServerByIdForUser(Long serverId, Long userId) {
        return serverRepository.findByIdAndUser_Id(serverId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Server not found"));
    }

    /**
     * delete server from db
     *
     * @param serverId
     * @param userId
     */
    @Transactional
    public void deleteServer(Long serverId, Long userId) {
        Server server = getServerByIdForUser(serverId, userId);
        serverRepository.delete(server);
    }

    public boolean existsByIdAndUserId(Long serverId, Long userId) {
        boolean exists = serverRepository.existsByIdAndUser_Id(serverId, userId);
        return  exists;
    }
    /**
     * get all of the server from db , only need id and lastHeartBeat
     *
     */
    @Transactional(readOnly = true)
    public List<Server> getAllServer(){

        return serverRepository.findAll();
    }

    /**
     * get all of the server from db , only need id and lastHeartBeat
     *
     */
    @Transactional(readOnly = true)
    public List<ServerHeartbeatView> getAllServerHeartBeat(){

        return serverRepository.findAllProjectedBy();
    }

    @Transactional
    public void updateServerStatus(Long serverId, ServerStatus status) {

        Server server = serverRepository.findById(serverId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Server not found"));

        serverRepository.updateServerStatus(server.getId(), status);
    }
}
