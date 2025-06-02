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

// Enhanced email transporter setup with debugging
const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.EMAIL_PORT || '465', 10),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    // Do not fail on invalid certs in development
    rejectUnauthorized: process.env.NODE_ENV !== 'production'
  },
  // Add debug logging
  debug: true,
  logger: true
};

console.log('📧 Email Configuration:');
console.log('- Host:', emailConfig.host);
console.log('- Port:', emailConfig.port);
console.log('- Secure:', emailConfig.secure);
console.log('- User:', emailConfig.auth.user);
console.log('- Password:', emailConfig.auth.pass ? '[HIDDEN]' : 'Not set');

// Create transporter with enhanced error handling
const transporter = nodemailer.createTransport(emailConfig);

// Verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('❌ SMTP Connection Error:', error);
  } else {
    console.log('✅ SMTP Server is ready to take our messages');
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
    
    try {
      // Send the OTP via email
      const mailOptions = {
        from: `"UniVendor" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Your Verification Code</h2>
            <p>Hello,</p>
            <p>Your verification code is: <strong>${otp}</strong></p>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, you can safely ignore this email.</p>
            <p>Best regards,<br>The UniVendor Team</p>
          </div>
        `
      };
      
      console.log(' Sending email with options:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject
      });
      
      // Send the email with detailed error handling
      const info = await transporter.sendMail(mailOptions);
      
      console.log(' Email sent successfully:', info.messageId);
      console.log(` OTP email sent to ${email}`);
      
      return res.status(200).json({
        success: true,
        message: 'OTP sent successfully',
        // Only include previewUrl in development
        ...(process.env.NODE_ENV !== 'production' && { previewUrl: `otp:${otp}` })
      });
      
    } catch (emailError) {
      console.error(' Email sending failed:', emailError);
      console.error('Error details:', {
        code: emailError.code,
        command: emailError.command,
        response: emailError.response,
        stack: emailError.stack
      });
      
      throw new Error('Failed to send OTP email. Please try again later.');
    }
  } catch (error) {
    console.error('Error in OTP request:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: error.message
    });
  }
});

// OTP verification endpoint
app.post('/api/auth/verify-otp', async (req, res) => {
  // Log the incoming request with timestamp
  const requestTime = new Date().toISOString();
  console.log('\n' + '='.repeat(80));
  console.log(`[${requestTime}] OTP Verification Request Received`);
  console.log('='.repeat(80));
  console.log('Request Body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { email, otp } = req.body;
    
    // Input validation
    if (!email) {
      const error = 'Email is required';
      console.error(`[ERROR] ${error}`);
      return res.status(400).json({ 
        success: false, 
        message: error 
      });
    }
    
    if (!otp) {
      const error = 'OTP is required';
      console.error(`[ERROR] ${error}`);
      return res.status(400).json({ 
        success: false, 
        message: error 
      });
    }
    
    // Normalize the input OTP
    const normalizedOtp = String(otp).replace(/\s+/g, '').trim();
    
    console.log('\n' + '='.repeat(50));
    console.log('🔍 OTP VERIFICATION PROCESS');
    console.log('='.repeat(50));
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 OTP Received: "${otp}" (Normalized: "${normalizedOtp}")`);
    
    // 1. Look up OTP in database
    console.log('\n🔎 Looking up OTP in database...');
    const storedOtp = await otpDb.getOtp(email);
    
    if (!storedOtp) {
      const error = 'No active OTP found for this email';
      console.error(`❌ ${error}`);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired OTP' 
      });
    }
    
    // 2. Prepare OTP data for comparison
    const normalizedStoredOtp = String(storedOtp.otp).replace(/\s+/g, '').trim();
    const isOtpMatch = normalizedOtp === normalizedStoredOtp;
    const isOtpExpired = new Date() > new Date(storedOtp.expires);
    
    // 3. Log verification details
    console.log('\n' + '='.repeat(50));
    console.log('🔍 OTP VERIFICATION DETAILS');
    console.log('='.repeat(50));
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Entered OTP: "${normalizedOtp}"`);
    console.log(`🔐 Stored OTP: "${normalizedStoredOtp}"`);
    console.log(`✅ OTP Match: ${isOtpMatch ? 'YES' : 'NO'}`);
    console.log(`⏰ Expires At: ${new Date(storedOtp.expires).toISOString()}`);
    console.log(`⏱️  Current Time: ${new Date().toISOString()}`);
    console.log(`❌ Expired: ${isOtpExpired ? 'YES' : 'NO'}`);
    
    // 4. Check if OTP is expired
    if (isOtpExpired) {
      const error = 'OTP has expired';
      console.error(`❌ ${error}`);
      // Clean up expired OTP
      await otpDb.deleteOtp(email);
      return res.status(400).json({ 
        success: false, 
        message: error 
      });
    }
    
    // 5. Verify OTP matches
    if (!isOtpMatch) {
      const error = 'OTP does not match';
      console.error(`❌ ${error}`);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP' 
      });
    }
    
    // 6. OTP is valid - proceed with login
    console.log('\n' + '✅ OTP VERIFICATION SUCCESSFUL');
    
    // Delete the used OTP
    console.log('\n🧹 Cleaning up used OTP...');
    await otpDb.deleteOtp(email);
    console.log('✅ OTP cleaned up successfully');
    
    // Fetch user data from database
    console.log('\n🔍 Fetching user data from database...');
    const userResult = await pool.query(
      'SELECT id, email, first_name as "firstName", last_name as "lastName", role FROM users WHERE email = $1', 
      [email]
    );
    
    if (!userResult.rows.length) {
      console.error('❌ User not found in database');
      return res.status(404).json({
        success: false,
        message: 'User not found. Please register first.'
      });
    }
    
    const userData = userResult.rows[0];
    
    console.log('\n' + '='.repeat(50));
    console.log('👤 USER AUTHENTICATED SUCCESSFULLY');
    console.log('='.repeat(50));
    console.log(`👋 Welcome, ${userData.firstName} ${userData.lastName}`);
    console.log(`📧 Email: ${userData.email}`);
    console.log(`👥 Role: ${userData.role}`);
    console.log(`🆔 User ID: ${userData.id}`);
    console.log('\n' + '='.repeat(80));
    
    // Return success response with user data
    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      user: userData
    });
    
  } catch (error) {
    console.error('\n❌ ERROR IN OTP VERIFICATION:');
    console.error(error);
    
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred during OTP verification',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
// Enable debug endpoint for testing
if (true || process.env.NODE_ENV !== 'production') {
  app.get('/api/debug/otp-store', async (req, res) => {
    try {
      // Query all OTPs from the database
      const result = await pool.query(
        'SELECT email, otp, expires, created_at FROM otps ORDER BY created_at DESC'
      );
      
      const otpData = {};
      
      // Format OTP data for display
      result.rows.forEach(row => {
        otpData[row.email] = {
          otp: row.otp,
          expires: new Date(row.expires).toISOString(),
          created_at: new Date(row.created_at).toISOString(),
          valid: new Date() < new Date(row.expires)
        };
      });
      
      console.log('Current OTPs in database:', otpData);
      return res.json({
        count: result.rows.length,
        otps: otpData
      });
    } catch (error) {
      console.error('Error fetching OTPs from database:', error);
      return res.status(500).json({ error: 'Failed to fetch OTPs' });
    }
  });
  
  console.log('Debug endpoint enabled: /api/debug/otp-store');
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
