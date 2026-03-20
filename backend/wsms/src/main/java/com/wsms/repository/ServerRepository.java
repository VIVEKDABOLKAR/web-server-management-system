package com.wsms.repository;

import com.wsms.entity.OSType;
import com.wsms.entity.Server;
import com.wsms.entity.ServerStatus;
import java.util.List;
import java.util.Optional;

import com.wsms.entity.WebServerType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServerRepository extends JpaRepository<Server, Long> {

    boolean existsByIpAddress(String ipAddress);

    List<Server> findAllByUser_Id(Long userId);

    Optional<Server> findByIdAndUser_Id(Long id, Long userId);

    int countByUser_Id(Long userId);

    int countByUser_IdAndStatus(Long userId, ServerStatus status);

    OSType save(OSType osType);

    WebServerType save(WebServerType webServerType);
}
