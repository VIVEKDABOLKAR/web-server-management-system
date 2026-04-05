package com.wsms.filter;

import com.github.f4b6a3.ulid.UlidCreator;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class LoggingContextFilter extends OncePerRequestFilter {

//    constant
private static final String TRACE_ID = "traceId";
    private static final String REQUEST_ID = "requestId";

    private static final String TRACE_HEADER = "Y-Trace-Id";
    private static final String REQUEST_HEADER = "Y-Request-Id";

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        //get r create traceid
        String traceId = request.getHeader(TRACE_HEADER);
        if (traceId == null || traceId.isEmpty()) {
            traceId = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        }

        //genrate reqId
        String requestId = generateRequestId() ;

        // Put into MDC (for logging)
        MDC.put(TRACE_ID, traceId);
        MDC.put(REQUEST_ID, requestId);

        // Add to response headers (VERY IMPORTANT)
        response.setHeader(TRACE_HEADER, traceId);
        response.setHeader(REQUEST_HEADER, requestId);

        try {
            filterChain.doFilter(request, response);
        } finally {
            MDC.clear(); // prevent memory leaks
        }
    }

    private String generateRequestId() {
        return UlidCreator.getUlid().toString();
    }
}
