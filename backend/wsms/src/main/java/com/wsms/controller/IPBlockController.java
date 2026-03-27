package com.wsms.controller;

import com.wsms.dto.ipblock.IPBlockResponse;
import com.wsms.entity.IPBlock;
import com.wsms.service.IPBlockService;
import com.wsms.service.ServerService;
import com.wsms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ip-blocks")
public class IPBlockController {

    private final UserService userService;
    private final ServerService serverService;
    private final IPBlockService ipBlockService;

    @GetMapping("/getIpblock/{serverId}")
    public ResponseEntity<List<IPBlockResponse>> getAllIPBlocks(@PathVariable Long serverId){
        Long userId = userService.getCurrentUser().getId();
        if(!serverService.existsByIdAndUserId(serverId, userId)){
            throw  new RuntimeException("Not found");
        }
      List<IPBlock> ipBlocks = ipBlockService.getAllIPBlock(serverId);
      List<IPBlockResponse> ipBlockResponses = new ArrayList<>();
      for(IPBlock ipBlock : ipBlocks){
          IPBlockResponse ipBlockResponse = toResponse(ipBlock);
          ipBlockResponses.add(ipBlockResponse);
      }
      return  ResponseEntity.ok(ipBlockResponses);
    }

    @PatchMapping("/{serverId}/{clientIp}")
    public ResponseEntity<IPBlockResponse> updateIPBlock(@PathVariable Long serverId,@PathVariable String clientIp){
            IPBlock ipBlock = ipBlockService.updateIPBlock(serverId,clientIp);
            return ResponseEntity.ok(toResponse(ipBlock));
    }


    private IPBlockResponse toResponse(IPBlock ipBlock) {
        IPBlockResponse ipBlockResponse = IPBlockResponse.builder()
                .id(ipBlock.getId())
                .clientIp(ipBlock.getClientIp())
                .status(ipBlock.getStatus())
                .lastRequest(ipBlock.getLastRequest())
                .serverId(ipBlock.getServerId())
                .build();
        return  ipBlockResponse;
    }

}
