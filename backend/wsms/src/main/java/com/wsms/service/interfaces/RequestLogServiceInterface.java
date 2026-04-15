package com.wsms.service.interfaces;

import com.wsms.dto.requestlog.RequestLogResponse;
import com.wsms.dto.requestlog.RequestLogSubmitRequest;
import com.wsms.entity.RequestLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RequestLogServiceInterface {

    RequestLogResponse submitRequestLog(RequestLogSubmitRequest request);

    Page<RequestLogResponse> getByServerId(Long serverId, Pageable pageable);

    Page<RequestLogResponse> getMethodByMethodName(Long serverId, String method, Pageable pageable);

    RequestLogResponse toResponse(RequestLog requestLog);
}
