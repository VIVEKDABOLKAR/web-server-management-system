package com.wsms.service;

import com.wsms.dto.requestlog.RequestLogResponse;
import com.wsms.dto.requestlog.RequestLogSubmitRequest;
import com.wsms.dto.server.ServerResponse;
import com.wsms.entity.IPBlock;
import com.wsms.entity.RequestLog;
import com.wsms.entity.Server;
import com.wsms.repository.RequestLogRepository;
import com.wsms.repository.ServerRepository;
import com.wsms.service.interfaces.RequestLogServiceInterface;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RequestLogService implements RequestLogServiceInterface {

    private final RequestLogRepository requestLogRepository;
    private final ServerRepository serverRepository;
    private final IPBlockService ipBlockService;

    public RequestLogResponse submitRequestLog(RequestLogSubmitRequest request) {
        log.info("Submitting request log - Server: {}, Client IP: {}, Method: {}, URL: {}",
                request.getServerId(), request.getClientIP(), request.getMethod(), request.getUrl());

        // Verify server exists
        Server server = serverRepository.findById(request.getServerId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Server not found with ID: " + request.getServerId()));

        // Create and save request log
        RequestLog requestLog = RequestLog.builder()
                .server(server)
                .clientIP(request.getClientIP())
                .method(request.getMethod())
                .url(request.getUrl())
                .statusCode(request.getStatusCode())
                .build();

        //create ipblock and save in the ipblock table for the first time
        String clientIP = requestLog.getClientIP();
        if(ipBlockService.isClientIP(clientIP,server.getId())){
             IPBlock ipBlock = ipBlockService.update(server.getId(),clientIP);
            log.info("Request IPBlock lastRequest updated successfully -ID : {} ",ipBlock.getId());

        }
        else{
            IPBlock ipBlock = IPBlock.builder()
                    .serverId(requestLog.getId())
                    .clientIp(requestLog.getClientIP())
                    .serverId(requestLog.getServer().getId())
                    .status("UNBLOCK")
                    .lastRequest(LocalDateTime.now())
                    .build();

            IPBlock savedIPBlock = ipBlockService.save(ipBlock);
            log.info("Request IPBlock saved successfully -ID : {}",savedIPBlock.getId());
        }


        RequestLog savedLog = requestLogRepository.save(requestLog);
        log.info("Request log saved successfully - ID: {}", savedLog.getId());

        return toResponse(savedLog);
    }
    public Page<RequestLogResponse> getByServerId(Long serverId, Pageable pageable) {
       return requestLogRepository.findByServerId(serverId, pageable)
                .map(this::toResponse);
    }

    public Page<RequestLogResponse> getMethodByMethodName(Long serverId,String method, Pageable pageable) {
       return requestLogRepository.findByServerIdAndMethod(serverId,method,pageable).map(this::toResponse);
    }


    public RequestLogResponse toResponse(RequestLog requestLog){
        return RequestLogResponse.builder()
                .id(requestLog.getId())
                .timestamp(requestLog.getTimestamp())
                .url(requestLog.getUrl())
                .clientIP(requestLog.getClientIP())
                .serverId(requestLog.getServer().getId())
                .method(requestLog.getMethod())
                .statusCode(requestLog.getStatusCode())
                .build();
    }



}
