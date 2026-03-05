package com.wsms.repository;

import com.wsms.entity.Server;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServerRepository extends JpaRepository<Server, Long> {

    boolean existsByIpAddress(String ipAddress);

    List<Server> findAllByUserId(Long userId);

    Optional<Server> findByIdAndUserId(Long id, Long userId);
}
