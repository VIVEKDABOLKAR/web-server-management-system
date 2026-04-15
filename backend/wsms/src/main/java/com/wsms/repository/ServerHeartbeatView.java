package com.wsms.repository;

import com.wsms.entity.ServerStatus;

import java.time.LocalDateTime;

public interface ServerHeartbeatView {

    Long getId();

    LocalDateTime getLastHeartbeat();

    ServerStatus getStatus();
}
