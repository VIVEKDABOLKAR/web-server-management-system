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

    List<Server> findAllByUserId(Long userId);

    Optional<Server> findByIdAndUserId(Long id, Long userId);
    
    int countByUserId(Long userId);
    
    int countByUserIdAndStatus(Long userId, ServerStatus status);

    OSType save(OSType osType);

    WebServerType save(WebServerType webServerType);
}
