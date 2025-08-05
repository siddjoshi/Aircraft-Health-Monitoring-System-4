package com.aircraft.monitoring.config;

import com.aircraft.monitoring.service.WebSocketService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

/**
 * WebSocket configuration for real-time aircraft data communication.
 * 
 * This configuration sets up WebSocket endpoints and handlers for
 * broadcasting aircraft sensor data to connected clients.
 * 
 * @author Aircraft Monitoring Team
 * @version 2.0.0
 */
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    
    private final WebSocketService webSocketService;
    
    @Value("${app.cors.allowed-origins:http://localhost:3000}")
    private String[] allowedOrigins;
    
    public WebSocketConfig(WebSocketService webSocketService) {
        this.webSocketService = webSocketService;
    }
    
    /**
     * Registers WebSocket handlers and endpoints with secure CORS configuration
     */
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(webSocketService, "/websocket")
                .setAllowedOrigins(allowedOrigins) // Secure origin configuration
                .withSockJS(); // Enable SockJS fallback for older browsers
    }
} 