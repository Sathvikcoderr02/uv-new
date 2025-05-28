const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Log all requests to help with debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware
app.use(cors({
  origin: ['https://uv-new-motk.vercel.app', 'http://localhost:5000', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Add pre-flight OPTIONS handling
app.options('*', cors());

app.use(express.json());

// Log all requests in detail for debugging
app.use((req, res, next) => {
  console.log('Request details:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body
  });
  next();
});

// Define the base path for all routes
const BASE_PATH = '';

// Test routes
app.get(BASE_PATH + '/', (req, res) => {
  res.json({ message: 'UniVendor API is running' });
});

// Debug route to check headers and connection
app.get(BASE_PATH + '/debug', (req, res) => {
  res.json({
    message: 'Debug info',
    headers: req.headers,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    basePath: BASE_PATH
  });
});

// Health check route
app.get(BASE_PATH + '/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Add duplicate routes at the root level for Render
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/debug', (req, res) => {
  res.json({
    message: 'Debug info',
    headers: req.headers,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    basePath: BASE_PATH
  });
});

// Authentication endpoints
// Handle both GET and POST for OTP request to fix 405 error
app.all('/api/auth/request-otp', (req, res) => {
  console.log('OTP request received:', {
    method: req.method,
    body: req.body,
    query: req.query
  });
  
  // Get email from either body (POST) or query params (GET)
  const email = req.body?.email || req.query?.email;
  
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  
  // In a real implementation, you would generate and send an OTP
  // For this temporary fix, we'll just return a success message
  return res.status(200).json({
    message: 'OTP sent successfully',
    previewUrl: `OTP for ${email} would be sent in production`
  });
});

// OTP verification endpoint
app.post('/api/auth/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }
  
  // For this temporary fix, accept any OTP
  // In production, you would validate against a stored OTP
  return res.status(200).json({
    id: 1,
    email: email,
    role: 'admin',
    firstName: 'Test',
    lastName: 'User'
  });
});

// Session endpoint
app.get('/api/auth/session', (req, res) => {
  // For this temporary fix, return null to indicate not authenticated
  return res.status(200).json(null);
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get product variants
app.get('/api/products/:id/variants', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM product_variants WHERE product_id = $1', [id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching product variants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});
