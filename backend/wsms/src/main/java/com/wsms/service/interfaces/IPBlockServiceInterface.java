package com.wsms.service.interfaces;

import com.wsms.entity.IPBlock;

import java.util.List;

public interface IPBlockServiceInterface {

    boolean isClientIP(String clientIP, Long serverId);

    IPBlock save(IPBlock ipBlock);

    IPBlock update(Long serverId, String clientIp);

    IPBlock findByClientIP(String clientIP);

    List<IPBlock> getAllIPBlock(Long serverId);

    IPBlock blockIp(Long serverId, String clientIp);

    IPBlock updateIPBlock(Long serverId, String clientIp);

    Boolean isUserVerified(Long serverId, String clientIp);
}
