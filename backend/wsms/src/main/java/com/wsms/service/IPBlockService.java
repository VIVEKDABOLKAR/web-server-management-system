package com.wsms.service;

import com.wsms.dto.ipblock.IPBlockResponse;
import com.wsms.entity.IPBlock;
import com.wsms.entity.Server;
import com.wsms.repository.IPBlockRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IPBlockService {

    private final IPBlockRepo ipBlockRepo;

    public boolean isClientIP(String clientIP,Long serverId){
          return  ipBlockRepo.existsByClientIpAndServerId(clientIP,serverId);
    }

    @Transactional
    public IPBlock save(IPBlock ipBlock) {
       return ipBlockRepo.save(ipBlock);
    }

    @Transactional
    public IPBlock update(Long serverId,String clientIp) {
        IPBlock ipBlock1 = ipBlockRepo.findByServerIdAndClientIp(serverId,clientIp);
        ipBlock1.setLastRequest(LocalDateTime.now());
        ipBlockRepo.save(ipBlock1);
        return ipBlock1;
    }


    public IPBlock findByClientIP(String clientIP) {
        return ipBlockRepo.findByClientIp(clientIP);
    }

    public List<IPBlock> getAllIPBlock(Long serverId) {
            List<IPBlock> ipBlocks = ipBlockRepo.findByServerId(serverId);
            return ipBlocks;
    }


    public IPBlock updateIPBlock(Long serverId, String clientIp) {
        IPBlock ipBlock1 = ipBlockRepo.findByServerIdAndClientIp(serverId,clientIp);
        ipBlock1.setStatus(ipBlock1.getStatus().equals("UNBLOCK") ?  "BLOCK" : "UNBLOCK");
        ipBlockRepo.save(ipBlock1);
        return ipBlock1;
    }

    public Boolean isUserVerified(Long serverId, String clientIp) {
        IPBlock ipBlock1 = ipBlockRepo.findByServerIdAndClientIp(serverId,clientIp);
        System.out.println(ipBlock1);
        if(ipBlock1==null){
            return  true;
        }
       return  ipBlock1.getStatus().equals("UNBLOCK") ?  true : false;
    }
}
