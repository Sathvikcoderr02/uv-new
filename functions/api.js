const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const app = express();

// Import database schema
const schema = require('../shared/schema');

// Configure database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize Drizzle ORM
const db = drizzle(pool, { schema });

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const products = await db.select().from(schema.products).where(eq(schema.products.id, productId));
    
    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    return res.status(200).json(products[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products/:id/variants', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const variants = await db.select().from(schema.productVariants).where(eq(schema.productVariants.productId, productId));
    
    return res.status(200).json(variants);
  } catch (error) {
    console.error('Error fetching product variants:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Not found handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Export the serverless function
module.exports.handler = serverless(app);
