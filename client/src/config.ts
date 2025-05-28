// API configuration
const config = {
  // Use environment variable in production, fallback to localhost in development
  apiBaseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://univendor-api.onrender.com' // This will be your Render.com API URL
    : 'http://localhost:3000',
  
  // Flag to enable console logging in development
  enableDebugLogs: process.env.NODE_ENV !== 'production'
};

export default config;
