// API configuration
const config = {
  // Use environment variable in production, fallback to localhost in development
  apiBaseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://univendor-api.onrender.com' // Render URLs typically use .com not .app
    : 'http://localhost:3000',
  
  // Flag to enable console logging in development
  enableDebugLogs: true // Enable logs in all environments temporarily for debugging
};

export default config;
