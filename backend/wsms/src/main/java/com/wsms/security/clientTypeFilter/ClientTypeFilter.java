package com.wsms.security.clientTypeFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class ClientTypeFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String clientType = request.getHeader("X-Client-Type");
        //for testing blocking - client type
        System.out.println("Client Type : " + clientType);

        //vallidate client type
        if (!"WEB".equals(clientType)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("Invalid client type");
//            System.out.println("Blocked request from IP: " + request.getRemoteAddr());
//            return;
        }

        filterChain.doFilter(request, response);
    }
}