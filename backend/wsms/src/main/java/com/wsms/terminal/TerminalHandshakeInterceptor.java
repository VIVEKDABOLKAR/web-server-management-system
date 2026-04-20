package com.wsms.terminal;

import java.util.Arrays;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.util.UriComponentsBuilder;

import com.wsms.security.JwtService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
//handshakeInterceptor is a spring websocket interface
public class TerminalHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Value("${app.cors.allowed-origins:http://localhost:5173,http://127.0.0.1:5173}")
    private String allowedOrigins;

    @Value("${app.websocket.require-secure:false}")
    private boolean requireSecureWebSocket;

    //validate token return true/false validation gate for terminal WebSocket connection.
    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes
    ) {
        String origin = request.getHeaders().getFirst(HttpHeaders.ORIGIN);
        String remote = request.getRemoteAddress() == null ? "unknown" : request.getRemoteAddress().toString();

        if (!isOriginAllowed(origin)) {
            response.setStatusCode(HttpStatus.FORBIDDEN);
            log.warn(
                    "event={} stage={} layer={} remote={} origin={} outcome={} statusCode={} message=\"Origin not allowed for websocket handshake\"",
                    "ws_handshake",
                    "ENTRY",
                    "websocket",
                    remote,
                    origin,
                    "FAILURE",
                    403
            );
            return false;
        }

        if (requireSecureWebSocket && !isSecureHandshake(request)) {
            response.setStatusCode(HttpStatus.FORBIDDEN);
            log.warn(
                    "event={} stage={} layer={} remote={} origin={} outcome={} statusCode={} message=\"Secure websocket is required in this environment\"",
                    "ws_handshake",
                    "ENTRY",
                    "websocket",
                    remote,
                    origin,
                    "FAILURE",
                    403
            );
            return false;
        }

        String token = UriComponentsBuilder.fromUri(request.getURI())
                .build()
                .getQueryParams()
                .getFirst("token");

        if (token == null || token.isBlank()) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            log.warn(
                    "event={} stage={} layer={} remote={} origin={} outcome={} statusCode={} message=\"Missing websocket auth token\"",
                    "ws_handshake",
                    "ENTRY",
                    "websocket",
                    remote,
                    origin,
                    "FAILURE",
                    401
            );
            return false;
        }

        try {
            String email = jwtService.extractEmail(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            if (!jwtService.isTokenValid(token, userDetails)) {
                response.setStatusCode(HttpStatus.UNAUTHORIZED);
                log.warn(
                        "event={} stage={} layer={} remote={} origin={} userEmail={} outcome={} statusCode={} message=\"Invalid websocket auth token\"",
                        "ws_handshake",
                        "ENTRY",
                        "websocket",
                        remote,
                        origin,
                        email,
                        "FAILURE",
                        401
                );
                return false;
            }

            attributes.put("userEmail", email);
            attributes.put("wsOrigin", origin == null ? "unknown" : origin);
            attributes.put("wsSecure", isSecureHandshake(request));
            log.info(
                    "event={} stage={} layer={} remote={} origin={} userEmail={} outcome={} statusCode={} message=\"Websocket handshake authenticated\"",
                    "ws_handshake",
                    "EXIT",
                    "websocket",
                    remote,
                    origin,
                    email,
                    "SUCCESS",
                    101
            );
            return true;
        } catch (RuntimeException ex) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            log.warn(
                    "event={} stage={} layer={} remote={} origin={} outcome={} statusCode={} errorType={} message=\"Websocket handshake authentication failed\"",
                    "ws_handshake",
                    "EXIT",
                    "websocket",
                    remote,
                    origin,
                    "FAILURE",
                    401,
                    ex.getClass().getSimpleName()
            );
            return false;
        }
    }

    //
    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception
    ) {
        // No-op.
    }

    private boolean isOriginAllowed(String origin) {
        if (origin == null || origin.isBlank()) {
            return true;
        }
        Set<String> allowed = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(value -> !value.isEmpty())
                .collect(Collectors.toSet());
        return allowed.contains(origin);
    }

    private boolean isSecureHandshake(ServerHttpRequest request) {
        String scheme = request.getURI() == null ? "" : request.getURI().getScheme();
        if ("wss".equalsIgnoreCase(scheme) || "https".equalsIgnoreCase(scheme)) {
            return true;
        }

        String forwardedProto = request.getHeaders().getFirst("X-Forwarded-Proto");
        if (forwardedProto == null || forwardedProto.isBlank()) {
            return false;
        }
        String proto = forwardedProto.split(",")[0].trim();
        return "wss".equalsIgnoreCase(proto) || "https".equalsIgnoreCase(proto);
    }
}
