package com.wsms.controller;

import com.wsms.dto.requestlog.RequestLogResponse;
import com.wsms.dto.server.ServerResponse;
import com.wsms.entity.RequestLog;
import com.wsms.entity.Server;
import com.wsms.service.RequestLogService;
import com.wsms.service.ServerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/request-logs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class RequestLogController {

    private  final RequestLogService requestLogService;
    private final ServerController serverController;
    private final ServerService serverService;
    @GetMapping("/server")
    public ResponseEntity<List<Server>> getAllServer(){
        Long userId = serverController.getLoggedInUserId();
        return  ResponseEntity.ok(serverService.getAllServersByUser(userId));
    }

    @GetMapping("/server/{serverId}")
    public ResponseEntity<Page<RequestLogResponse>> getAllLog( @PathVariable Long serverId,Pageable pageable){
             return ResponseEntity.ok(requestLogService.getByServerId(serverId,pageable));
    }

    @GetMapping("/method/{method}")
    public ResponseEntity<Page<RequestLogResponse>> getMethodByMethodName(@PathVariable String method,Pageable pageable,@RequestParam Long serverId){
        return ResponseEntity.ok( requestLogService.getMethodByMethodName(serverId,method,pageable));
    }

}
