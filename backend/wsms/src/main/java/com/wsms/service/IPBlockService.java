package com.wsms.service;

import com.wsms.entity.IPBlock;
import com.wsms.repository.IPBlockRepo;
import com.wsms.service.interfaces.IPBlockServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IPBlockService implements IPBlockServiceInterface {

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
        IPBlock ipBlock1 = getRequiredIpBlock(serverId, clientIp);
        ipBlock1.setLastRequest(LocalDateTime.now());
        ipBlockRepo.save(ipBlock1);
        return ipBlock1;
    }


    public IPBlock findByClientIP(String clientIP) {
        return ipBlockRepo.findByClientIp(clientIP);
    }

    public List<IPBlock> getAllIPBlock(Long serverId) {
        return ipBlockRepo.findByServerId(serverId);
    }

    @Transactional
    public IPBlock blockIp(Long serverId, String clientIp) {
        IPBlock existing = ipBlockRepo.findByServerIdAndClientIp(serverId, clientIp);
        if (existing != null) {
            existing.setStatus("BLOCK");
            existing.setLastRequest(LocalDateTime.now());
            return ipBlockRepo.save(existing);
        }

        IPBlock newIpBlock = IPBlock.builder()
                .serverId(serverId)
                .clientIp(clientIp)
                .status("BLOCK")
                .lastRequest(LocalDateTime.now())
                .build();

        return ipBlockRepo.save(newIpBlock);
    }


    public IPBlock updateIPBlock(Long serverId, String clientIp) {
        IPBlock ipBlock1 = getRequiredIpBlock(serverId, clientIp);
        ipBlock1.setStatus("UNBLOCK".equals(ipBlock1.getStatus()) ? "BLOCK" : "UNBLOCK");
        ipBlockRepo.save(ipBlock1);
        return ipBlock1;
    }

    public Boolean isUserVerified(Long serverId, String clientIp) {
        IPBlock ipBlock1 = ipBlockRepo.findByServerIdAndClientIp(serverId,clientIp);
        if(ipBlock1==null){
            return true;
        }
       return "UNBLOCK".equals(ipBlock1.getStatus());
    }

    private IPBlock getRequiredIpBlock(Long serverId, String clientIp) {
        IPBlock ipBlock = ipBlockRepo.findByServerIdAndClientIp(serverId, clientIp);
        if (ipBlock == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "IP block record not found");
        }
        return ipBlock;
    }
}
