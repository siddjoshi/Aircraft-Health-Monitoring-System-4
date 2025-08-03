package com.aircraft.monitoring.service;

import com.aircraft.monitoring.model.AircraftData;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.List;

/**
 * WebSocket service for real-time aircraft data communication.
 * 
 * This service handles WebSocket connections and broadcasts aircraft sensor data
 * to all connected clients in real-time.
 * 
 * @author Aircraft Monitoring Team
 * @version 1.0.0
 */
@Service
@Slf4j
public class WebSocketService extends TextWebSocketHandler {
    
    private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    /**
     * Handles new WebSocket connections
     */
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        log.info("New WebSocket connection established: {}", session.getId());
        
        // Send welcome message
        String welcomeMessage = "{\"type\":\"connection\",\"message\":\"Connected to Aircraft Monitoring System\"}";
        session.sendMessage(new TextMessage(welcomeMessage));
    }
    
    /**
     * Handles WebSocket connection closure
     */
    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) throws Exception {
        sessions.remove(session);
        log.info("WebSocket connection closed: {} with status: {}", session.getId(), status);
    }
    
    /**
     * Handles incoming WebSocket messages
     */
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        log.debug("Received WebSocket message from {}: {}", session.getId(), payload);
        
        // Handle different message types
        try {
            // For now, just echo back the message
            String response = "{\"type\":\"echo\",\"message\":\"" + payload + "\"}";
            session.sendMessage(new TextMessage(response));
        } catch (Exception e) {
            log.error("Error handling WebSocket message", e);
        }
    }
    
    /**
     * Broadcasts aircraft data to all connected WebSocket clients
     * 
     * @param aircraftData The aircraft sensor data to broadcast
     */
    public void broadcastAircraftData(AircraftData aircraftData) {
        if (sessions.isEmpty()) {
            return;
        }
        
        try {
            String jsonData = objectMapper.writeValueAsString(aircraftData);
            String message = "{\"type\":\"aircraft_data\",\"data\":" + jsonData + "}";
            TextMessage textMessage = new TextMessage(message);
            
            // Send to all connected sessions
            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    try {
                        session.sendMessage(textMessage);
                    } catch (IOException e) {
                        log.error("Error sending message to session: {}", session.getId(), e);
                        sessions.remove(session);
                    }
                } else {
                    sessions.remove(session);
                }
            }
            
            log.debug("Broadcasted aircraft data to {} clients", sessions.size());
            
        } catch (Exception e) {
            log.error("Error broadcasting aircraft data", e);
        }
    }
    
    /**
     * Sends a system alert to all connected clients
     * 
     * @param alertType The type of alert
     * @param message The alert message
     * @param severity The severity level (INFO, WARNING, CRITICAL)
     */
    public void broadcastAlert(String alertType, String message, String severity) {
        if (sessions.isEmpty()) {
            return;
        }
        
        try {
            String alertMessage = String.format(
                "{\"type\":\"alert\",\"alertType\":\"%s\",\"message\":\"%s\",\"severity\":\"%s\"}",
                alertType, message, severity
            );
            TextMessage textMessage = new TextMessage(alertMessage);
            
            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    try {
                        session.sendMessage(textMessage);
                    } catch (IOException e) {
                        log.error("Error sending alert to session: {}", session.getId(), e);
                        sessions.remove(session);
                    }
                } else {
                    sessions.remove(session);
                }
            }
            
            log.info("Broadcasted alert: {} - {}", alertType, message);
            
        } catch (Exception e) {
            log.error("Error broadcasting alert", e);
        }
    }
    
    /**
     * Gets the number of connected WebSocket clients
     * 
     * @return Number of active connections
     */
    public int getConnectedClientsCount() {
        return sessions.size();
    }
    
    /**
     * Sends a custom message to all connected clients
     * 
     * @param messageType The type of message
     * @param data The message data
     */
    public void broadcastCustomMessage(String messageType, Object data) {
        if (sessions.isEmpty()) {
            return;
        }
        
        try {
            String jsonData = objectMapper.writeValueAsString(data);
            String message = String.format("{\"type\":\"%s\",\"data\":%s}", messageType, jsonData);
            TextMessage textMessage = new TextMessage(message);
            
            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    try {
                        session.sendMessage(textMessage);
                    } catch (IOException e) {
                        log.error("Error sending custom message to session: {}", session.getId(), e);
                        sessions.remove(session);
                    }
                } else {
                    sessions.remove(session);
                }
            }
            
            log.debug("Broadcasted custom message: {}", messageType);
            
        } catch (Exception e) {
            log.error("Error broadcasting custom message", e);
        }
    }
} 