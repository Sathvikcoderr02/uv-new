// API configuration
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';

// Determine the base URL based on the environment
const getApiBaseUrl = () => {
  // If we have a custom domain in production
  if (isProduction) {
    return 'https://uv-new-1.onrender.com'; // Your Render backend URL
  }
  
  // Local development
  return 'http://localhost:3000';
};

const config = {
  // API base URL
  apiBaseUrl: getApiBaseUrl(),
  
  // WebSocket URL - same as API but with ws(s) protocol
  wsBaseUrl: getApiBaseUrl().replace(/^http/, 'ws'),
  
  // Flag to enable console logging - true in development, false in production
  enableDebugLogs: !isProduction,
  
  // API version - increment this when making breaking changes
  apiVersion: 'v1',
  
  // Frontend URL
  frontendUrl: isProduction 
    ? 'https://uv-new.vercel.app' 
    : 'http://localhost:3000',
  
  // Environment information
  env: {
    isProduction,
    isVercel,
    nodeEnv: process.env.NODE_ENV || 'development',
  }
};

// Log the config in development
if (!isProduction) {
  console.log('App Config:', {
    ...config,
    // Don't log sensitive info in production
    env: {
      ...config.env,
      // Add any other non-sensitive env vars you want to log
    }
  });
}

export default config;
