package com.wsms.security.clientTypeFilter;

import com.wsms.service.AdminRuntimeConfigService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class ClientTypeFilter extends OncePerRequestFilter {

//    constant
    private static final String CLIENT_TYPE_HEADER = "Y-Client-Type";

    private final AdminRuntimeConfigService adminRuntimeConfigService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String clientType = request.getHeader(CLIENT_TYPE_HEADER);

        boolean isWebClient = !"WEB".equals(clientType);
        boolean webClientAllowed = adminRuntimeConfigService.isAllowWebClientRequests();
        String uri = request.getRequestURI();

//        if (!webClientAllowed && isWebClient ) {
//            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
//            response.getWriter().write("Web client requests are disabled by admin configuration");
//            return;
//        }

        filterChain.doFilter(request, response);
    }
}