const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
async function testDbConnection() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to the database');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Test the database connection on startup
testDbConnection().then(connected => {
  if (!connected) {
    console.error('Failed to connect to the database. Check your DATABASE_URL and database settings.');
  }
}).catch(error => {
  console.error('Error in database connection test:', error);
});

const app = express();
const port = process.env.PORT || 3000;

// Only start the server if this file is run directly
const isMainModule = require.main === module;

// Enable CORS with specific options
const allowedOrigins = [
  'https://uv-new.vercel.app',
  'https://uv-new-motk.vercel.app',
  'https://uv-new-1.onrender.com',
  'http://localhost:3000',
  'http://localhost:5000'
];

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, {
    origin: req.headers.origin,
    'user-agent': req.headers['user-agent']
  });
  next();
});

// Handle preflight requests first
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-requested-with');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.status(204).end();
  } else {
    res.status(403).end();
  }
});

// Apply CORS middleware for all other requests
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  next();
});

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

// OTP database functions
const otpDb = {
  // Store OTP in database
  async storeOtp(email, otp, expiresInMinutes = 10) {
    try {
      // Delete any existing OTPs for this email
      await pool.query('DELETE FROM otps WHERE email = $1', [email]);
      
      // Calculate expiration time
      const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
      
      // Insert new OTP
      await pool.query(
        'INSERT INTO otps (email, otp, expires) VALUES ($1, $2, $3)',
        [email, otp, expiresAt]
      );
      
      console.log(`OTP stored in database for ${email}`);
      return true;
    } catch (error) {
      console.error('Error storing OTP in database:', error);
      return false;
    }
  },
  
  // Get OTP from database
  async getOtp(email) {
    try {
      const result = await pool.query(
        'SELECT otp, expires FROM otps WHERE email = $1 ORDER BY created_at DESC LIMIT 1',
        [email]
      );
      
      if (result.rows.length === 0) {
        console.log(`No OTP found in database for ${email}`);
        return null;
      }
      
      const { otp, expires } = result.rows[0];
      
      // Check if OTP has expired
      if (new Date() > new Date(expires)) {
        console.log(`OTP for ${email} has expired`);
        // Clean up expired OTP
        await pool.query('DELETE FROM otps WHERE email = $1', [email]);
        return null;
      }
      
      return { otp, expires };
    } catch (error) {
      console.error('Error getting OTP from database:', error);
      return null;
    }
  },
  
  // Delete OTP from database
  async deleteOtp(email) {
    try {
      await pool.query('DELETE FROM otps WHERE email = $1', [email]);
      console.log(`OTP deleted from database for ${email}`);
      return true;
    } catch (error) {
      console.error('Error deleting OTP from database:', error);
      return false;
    }
  },
  
  // Clean up expired OTPs
  async cleanupExpiredOtps() {
    try {
      const result = await pool.query('DELETE FROM otps WHERE expires < NOW()');
      console.log(`Cleaned up ${result.rowCount} expired OTPs`);
      return result.rowCount;
    } catch (error) {
      console.error('Error cleaning up expired OTPs:', error);
      return 0;
    }
  }
};

// Log all requests to help with debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
// Handle OTP request endpoint
app.post('/api/auth/request-otp', async (req, res) => {
  console.log('OTP Request Headers:', req.headers);
  console.log('OTP Request Body:', req.body);
  
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  
  try {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Log the generated OTP for debugging
    console.log('==============================================');
    console.log(`📬 OTP GENERATED for ${email}: ${otp}`);
    console.log('==============================================');
    
    // Store the OTP in the database (expires in 10 minutes)
    const stored = await otpDb.storeOtp(email, otp, 10);
    
    if (!stored) {
      throw new Error('Failed to store OTP in database');
    }
    
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
    
    // Store OTP in database with 10-minute expiration
    await otpDb.storeOtp(email, otp, 10);
    
    // In development, log the OTP to console
    console.log(`OTP for ${email}: ${otp}`);
    
    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      // Only include previewUrl in development
      ...(process.env.NODE_ENV !== 'production' && { previewUrl: `otp:${otp}` })
    });
  } catch (error) {
    console.error('Error in OTP request:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: error.message
    });
app.post('/api/auth/verify-otp', async (req, res) => {
  console.log('==============================================');
  console.log('[DEBUG] Verify OTP request received:', JSON.stringify(req.body, null, 2));
  
  const { email, otp } = req.body;
  
  // Input validation
  if (!email) {
    const error = 'Email is required';
    console.error(`[ERROR] ${error}`);
    return res.status(400).json({ success: false, message: error });
  }
  
  if (!otp) {
    const error = 'OTP is required';
    console.error(`[ERROR] ${error}`);
    return res.status(400).json({ success: false, message: error });
  }
  
  // Normalize OTP (remove spaces, convert to string)
  const normalizedOtp = String(otp).replace(/\s+/g, '').trim();
  
  try {
    // 1. Look up OTP in database
    console.log(`[DEBUG] Looking up OTP for email: ${email}`);
    const storedOtp = await otpDb.getOtp(email);
    
    if (!storedOtp) {
      const error = 'No OTP found for email';
      console.error(`[ERROR] ${error}:`, email);
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
    
    // 2. Log OTP comparison details
    const normalizedStoredOtp = String(storedOtp.otp).replace(/\s+/g, '').trim();
    
    console.log('==============================================');
    console.log(`🔍 OTP VERIFICATION for ${email}:`);
    console.log(`   User entered: "${normalizedOtp}"`);
    console.log(`   Stored in DB: "${normalizedStoredOtp}"`);
    console.log(`   Expires at: ${storedOtp.expires}`);
    console.log(`   Current time: ${new Date().toISOString()}`);
    console.log('==============================================');
    
    // 3. Check if OTP is expired
    if (new Date(storedOtp.expires) < new Date()) {
      const error = 'OTP has expired';
      console.error(`[ERROR] ${error}`);
      await otpDb.deleteOtp(email);
      return res.status(400).json({ success: false, message: error });
    }
    
    // 4. Verify OTP matches
    if (normalizedOtp !== normalizedStoredOtp) {
      const error = 'OTP does not match';
      console.error(`[ERROR] ${error}`);
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    
    // 5. OTP is valid - proceed with login
    console.log(`[SUCCESS] OTP verified for email: ${email}`);
    
    // Delete the used OTP
    console.log(`[DEBUG] Deleting used OTP for email: ${email}`);
    await otpDb.deleteOtp(email);
    
    // Return user data (in a real app, you'd generate a JWT token here)
    const userData = {
      id: 1, // Replace with actual user ID from your database
      email,
      role: 'user',
      firstName: 'Test',
      lastName: 'User'
    };
    
    console.log('[SUCCESS] User authenticated successfully:', JSON.stringify(userData, null, 2));
    console.log('==============================================');
    
    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      user: userData
    });
    
  } catch (error) {
    console.error('[ERROR] Error in OTP verification:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
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

// Debug endpoint to view OTPs in database (only in development)
// Enable debug endpoints in non-production or when explicitly enabled
if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_DEBUG === 'true') {
  console.log('Debug endpoints are enabled');
  
  // Endpoint to view all OTPs in the database
  app.get('/api/debug/otp-store', async (req, res) => {
    try {
      console.log('[DEBUG] Fetching all OTPs from database');
      
      // Query all OTPs from the database
      const result = await pool.query(
        'SELECT * FROM otps ORDER BY created_at DESC'
      );
      
      const otpData = {};
      const now = new Date();
      
      // Format OTP data for display
      result.rows.forEach(row => {
        const expires = new Date(row.expires);
        otpData[row.email] = {
          otp: row.otp,
          expires: expires.toISOString(),
          created_at: new Date(row.created_at).toISOString(),
          valid: now < expires,
          expires_in_seconds: Math.max(0, Math.round((expires - now) / 1000))
        };
      });
      
      console.log(`[DEBUG] Found ${result.rows.length} OTPs in database`);
      
      return res.json({
        success: true,
        count: result.rows.length,
        otps: otpData,
        current_time: now.toISOString()
      });
    } catch (error) {
      console.error('[ERROR] Error fetching OTPs from database:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch OTPs',
        details: error.message 
      });
    }
  });
  
  console.log('Debug endpoint enabled: /api/debug/otp-store');
} else {
  console.log('Debug endpoints are disabled in production');
}

// Start the server only if this file is run directly
if (isMainModule) {
  app.listen(port, () => {
    console.log(`API Server is running on port ${port}`);
    console.log('Email verification enabled with SMTP server: smtp.hostinger.com');
  });
}

// Export the app for mounting in the main server
module.exports = { app };
