package com.wsms.terminal;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
@Slf4j
public class TerminalWebSocketConfig implements WebSocketConfigurer {

    private final TerminalWebSocketHandler terminalWebSocketHandler;
    private final TerminalHandshakeInterceptor terminalHandshakeInterceptor;

    @Value("${app.cors.allowed-origins:http://localhost:5173,http://127.0.0.1:5173}")
    private String allowedOrigins;

        @Value("${app.websocket.terminal.path:/ws/terminal}")
        private String terminalPath;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        String[] origins = Arrays.stream(allowedOrigins.split(","))
            .map(String::trim)
            .filter(origin -> !origin.isEmpty())
            .toArray(String[]::new);

        registry.addHandler(terminalWebSocketHandler, terminalPath)
                .addInterceptors(terminalHandshakeInterceptor)
            .setAllowedOrigins(origins);

        log.info(
            "event={} layer={} path={} allowedOriginsCount={} message=\"Terminal websocket registered\"",
            "ws_config",
            "websocket",
            terminalPath,
            origins.length
        );
    }
}
