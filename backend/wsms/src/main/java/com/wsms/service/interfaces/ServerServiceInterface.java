package com.wsms.service.interfaces;

import com.wsms.dto.server.AddServerRequest;
import com.wsms.entity.Server;
import com.wsms.entity.ServerStatus;
import com.wsms.repository.ServerHeartbeatView;

import java.util.List;

public interface ServerServiceInterface {

    Server addServer(AddServerRequest dto, Long userId);

    Server updateServer(Long id, AddServerRequest dto);

    List<Server> getAllServersByUser(Long userId);

    Server getServerById(Long serverId);

    Server getServerByIdForUser(Long serverId, Long userId);

    void deleteServer(Long serverId, Long userId);

    boolean existsByIdAndUserId(Long serverId, Long userId);

    List<Server> getAllServer();

    List<ServerHeartbeatView> getAllServerHeartBeat();

    void updateServerStatus(Long serverId, ServerStatus status);
}
