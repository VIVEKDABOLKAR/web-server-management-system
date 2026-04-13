package com.wsms.service;

import com.wsms.entity.IPBlock;
import com.wsms.entity.Server;
import com.wsms.repository.IPBlockRepo;
import com.wsms.repository.ServerRepository;
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
    private final ServerRepository serverRepository;

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
    public IPBlock touchOrCreateForRequest(Long serverId, String clientIp) {
        String normalizedIp = clientIp == null ? null : clientIp.trim();
        List<IPBlock> matches = ipBlockRepo.findAllByServerIdAndClientIpOrderByIdDesc(serverId, normalizedIp);

        if (matches.isEmpty()) {
            IPBlock created = IPBlock.builder()
                    .server(getRequiredServer(serverId))
                    .clientIp(normalizedIp)
                    .status("UNBLOCK")
                    .lastRequest(LocalDateTime.now())
                    .build();
            return ipBlockRepo.save(created);
        }

        IPBlock latest = matches.get(0);
        latest.setLastRequest(LocalDateTime.now());
        IPBlock saved = ipBlockRepo.save(latest);

        if (matches.size() > 1) {
            ipBlockRepo.deleteAll(matches.subList(1, matches.size()));
        }

        return saved;
    }

    @Transactional
    public IPBlock blockIp(Long serverId, String clientIp) {
        String normalizedIp = clientIp == null ? null : clientIp.trim();
        IPBlock existing = ipBlockRepo.findTopByServerIdAndClientIpOrderByIdDesc(serverId, normalizedIp);
        if (existing != null) {
            existing.setStatus("BLOCK");
            existing.setLastRequest(LocalDateTime.now());
            return ipBlockRepo.save(existing);
        }

        IPBlock newIpBlock = IPBlock.builder()
            .server(getRequiredServer(serverId))
                .clientIp(normalizedIp)
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
        IPBlock ipBlock1 = ipBlockRepo.findTopByServerIdAndClientIpOrderByIdDesc(serverId, clientIp);
        if(ipBlock1==null){
            return true;
        }
       return "UNBLOCK".equals(ipBlock1.getStatus());
    }

    private IPBlock getRequiredIpBlock(Long serverId, String clientIp) {
        String normalizedIp = clientIp == null ? null : clientIp.trim();
        IPBlock ipBlock = ipBlockRepo.findTopByServerIdAndClientIpOrderByIdDesc(serverId, normalizedIp);
        if (ipBlock == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "IP block record not found");
        }
        return ipBlock;
    }

    private Server getRequiredServer(Long serverId) {
        return serverRepository.findById(serverId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Server not found"));
    }
}
