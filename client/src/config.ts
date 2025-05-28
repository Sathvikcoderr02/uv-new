// API configuration
const config = {
  // Use environment variable in production, fallback to localhost in development
  apiBaseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://univendor-api.onrender.com' // Replace with your actual backend API URL
    : 'http://localhost:3000'
};

export default config;
