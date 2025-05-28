// API configuration
const config = {
  // Use environment variable in production, fallback to localhost in development
  apiBaseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://uv-new-1.onrender.com' // Correct Render URL
    : 'http://localhost:3000',
  
  // Flag to enable console logging in development
  enableDebugLogs: true, // Enable logs in all environments temporarily for debugging
  
  // API version - increment this when making breaking changes
  apiVersion: 'v1'
};

export default config;
