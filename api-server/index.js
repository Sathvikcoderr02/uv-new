const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'verification@lelekart.com',
    pass: 'Ayushcha123@'
  }
});

// Store OTPs temporarily (in production, use a database)
const otpStore = new Map();

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
app.all('/api/auth/request-otp', async (req, res) => {
  console.log(`${req.method} request to /api/auth/request-otp`);
  console.log('Request body:', req.body);
  console.log('Request query:', req.query);
  
  // Get email from either body (POST) or query (GET)
  const email = req.method === 'POST' ? req.body.email : req.query.email;
  
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  
  try {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store the OTP with a timestamp (expires in 10 minutes)
    otpStore.set(email, {
      otp,
      expires: Date.now() + 10 * 60 * 1000 // 10 minutes
    });
    
    // Send the OTP via email
    const mailOptions = {
      from: '"UniVendor" <verification@lelekart.com>',
      to: email,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">UniVendor Verification</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f4f4f9; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    return res.status(200).json({
      message: 'OTP sent successfully',
      previewUrl: `OTP sent to ${email}`
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// OTP verification endpoint
app.post('/api/auth/verify-otp', (req, res) => {
  console.log('Verify OTP request received:', req.body);
  const { email, otp } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  
  if (!otp) {
    return res.status(400).json({ message: 'OTP is required' });
  }
  
  // Check if OTP exists and is valid
  const storedOTPData = otpStore.get(email);
  
  if (!storedOTPData) {
    console.log('No OTP found for email:', email);
    return res.status(400).json({ message: 'Invalid OTP or OTP expired' });
  }
  
  // Check if OTP has expired
  if (Date.now() > storedOTPData.expires) {
    console.log('OTP expired for email:', email);
    otpStore.delete(email); // Clean up expired OTP
    return res.status(400).json({ message: 'OTP expired' });
  }
  
  // Verify OTP
  if (otp !== storedOTPData.otp) {
    console.log('Invalid OTP provided:', otp);
    return res.status(400).json({ message: 'Invalid OTP' });
  }
  
  // OTP verified successfully, clean up
  otpStore.delete(email);
  
  console.log('OTP verified successfully for:', email);
  return res.status(200).json({
    id: 1,
    email: email,
    role: 'user',
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
  console.log('Email verification enabled with SMTP server: smtp.hostinger.com');
});
