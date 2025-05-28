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

// Define product routes with and without base path for compatibility
function defineProductRoutes(basePath = '') {
  // Get product by ID
  app.get(`${basePath}/api/products/:id`, async (req, res) => {
    try {
      console.log(`Fetching product with ID: ${req.params.id}`);
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        console.log(`Product not found: ${id}`);
        return res.status(404).json({ error: 'Product not found' });
      }
      
      console.log(`Product found: ${id}`);
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });

  // Get product variants
  app.get(`${basePath}/api/products/:id/variants`, async (req, res) => {
    try {
      console.log(`Fetching variants for product ID: ${req.params.id}`);
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM product_variants WHERE product_id = $1', [id]);
      console.log(`Found ${result.rows.length} variants for product ${id}`);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching product variants:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });
}

// Define routes with both base paths for maximum compatibility
defineProductRoutes(); // Default routes without base path
defineProductRoutes(BASE_PATH); // Routes with base path

// Start the server
app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});
