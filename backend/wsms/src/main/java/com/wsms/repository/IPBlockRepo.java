package com.wsms.repository;

import com.wsms.entity.IPBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IPBlockRepo extends JpaRepository<IPBlock,Long> {
    boolean existsByClientIpAndServerId(String clientIP,Long serverId);

    IPBlock findByClientIp(String clientIP);

    List<IPBlock> findByServerId(Long id);

    IPBlock findByServerIdAndClientIp(Long serverId, String clientIp);
}
