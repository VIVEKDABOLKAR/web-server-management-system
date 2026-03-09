package com.wsms.repository;

import com.wsms.entity.BlockedIp;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlockedIpRepository extends JpaRepository<BlockedIp, Long> {

    List<BlockedIp> findAllByServerIdOrderByCreatedAtDesc(Long serverId);

    boolean existsByServerIdAndIpAddress(Long serverId, String ipAddress);

    Optional<BlockedIp> findByIdAndServerUserId(Long id, Long userId);
}
