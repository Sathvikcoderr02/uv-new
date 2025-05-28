const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

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

// Test routes
app.get('/', (req, res) => {
  res.json({ message: 'UniVendor API is running' });
});

// Debug route to check headers and connection
app.get('/debug', (req, res) => {
  res.json({
    message: 'Debug info',
    headers: req.headers,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
