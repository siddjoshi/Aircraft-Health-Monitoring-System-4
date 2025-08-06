// Environment configuration for different deployment targets
const config = {
  development: {
    API_BASE_URL: 'http://localhost:8080',
    WS_BASE_URL: 'http://localhost:8080'
  },
  production: {
    API_BASE_URL: window.location.origin,
    WS_BASE_URL: window.location.origin
  }
};

// Determine environment
const environment = process.env.NODE_ENV || 'development';

// Export configuration based on environment
export default config[environment];