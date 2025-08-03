import SockJS from 'sockjs-client';

/**
 * WebSocket service for real-time aircraft data communication
 * 
 * This service handles WebSocket connections to the backend and provides
 * event-based communication for aircraft sensor data and alerts.
 * 
 * @author Aircraft Monitoring Team
 * @version 1.0.0
 */
class WebSocketService {
  constructor() {
    this.socket = null;
    this.stompClient = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 2000;
    
    // Event callbacks
    this.onAircraftDataCallback = null;
    this.onAlertCallback = null;
    this.onConnectionStatusCallback = null;
  }

  /**
   * Connects to the WebSocket server
   */
  async connect() {
    return new Promise((resolve, reject) => {
      try {
        // Create SockJS connection
        this.socket = new SockJS('http://localhost:8080/websocket');
        
        // Set up connection handlers
        this.socket.onopen = () => {
          console.log('WebSocket connection established');
          this.connected = true;
          this.reconnectAttempts = 0;
          this.updateConnectionStatus('connected');
          resolve();
        };

        this.socket.onclose = (event) => {
          console.log('WebSocket connection closed:', event);
          this.connected = false;
          this.updateConnectionStatus('disconnected');
          
          // Attempt to reconnect
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            setTimeout(() => this.connect(), this.reconnectDelay);
          }
        };

        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.connected = false;
          this.updateConnectionStatus('error');
          reject(error);
        };

        this.socket.onmessage = (event) => {
          this.handleMessage(event.data);
        };

      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        this.connected = false;
        this.updateConnectionStatus('error');
        reject(error);
      }
    });
  }

  /**
   * Disconnects from the WebSocket server
   */
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.connected = false;
    this.updateConnectionStatus('disconnected');
  }

  /**
   * Handles incoming WebSocket messages
   * 
   * @param {string} data The message data
   */
  handleMessage(data) {
    try {
      const message = JSON.parse(data);
      
      switch (message.type) {
        case 'aircraft_data':
          if (this.onAircraftDataCallback) {
            this.onAircraftDataCallback(message.data);
          }
          break;
          
        case 'alert':
          if (this.onAlertCallback) {
            this.onAlertCallback(message);
          }
          break;
          
        case 'connection':
          console.log('Connection message:', message.message);
          break;
          
        case 'echo':
          console.log('Echo message:', message.message);
          break;
          
        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  /**
   * Sends a message to the WebSocket server
   * 
   * @param {Object} message The message to send
   */
  sendMessage(message) {
    if (this.socket && this.connected) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  }

  /**
   * Sets the callback for aircraft data updates
   * 
   * @param {Function} callback The callback function
   */
  onAircraftData(callback) {
    this.onAircraftDataCallback = callback;
  }

  /**
   * Sets the callback for alert messages
   * 
   * @param {Function} callback The callback function
   */
  onAlert(callback) {
    this.onAlertCallback = callback;
  }

  /**
   * Sets the callback for connection status updates
   * 
   * @param {Function} callback The callback function
   */
  onConnectionStatus(callback) {
    this.onConnectionStatusCallback = callback;
  }

  /**
   * Updates the connection status and notifies listeners
   * 
   * @param {string} status The connection status
   */
  updateConnectionStatus(status) {
    if (this.onConnectionStatusCallback) {
      this.onConnectionStatusCallback(status);
    }
  }

  /**
   * Checks if the WebSocket is connected
   * 
   * @returns {boolean} True if connected, false otherwise
   */
  isConnected() {
    return this.connected;
  }

  /**
   * Sends a custom alert request to the server
   * 
   * @param {string} alertType The type of alert
   * @param {string} message The alert message
   * @param {string} severity The severity level
   */
  sendAlert(alertType, message, severity = 'INFO') {
    const alertMessage = {
      type: 'alert_request',
      alertType,
      message,
      severity
    };
    
    this.sendMessage(alertMessage);
  }

  /**
   * Requests current aircraft data from the server
   */
  requestAircraftData() {
    const requestMessage = {
      type: 'request_aircraft_data'
    };
    
    this.sendMessage(requestMessage);
  }
}

export default WebSocketService; 