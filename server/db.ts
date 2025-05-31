import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "../shared/schema";

// Enhanced database connection logging with timestamps
const logDbConnection = () => {
  const timestamp = new Date().toISOString();
  
  if (!process.env.DATABASE_URL) {
    const error = new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?"
    );
    console.error(`[${timestamp}] ❌ Database connection error:`, error.message);
    throw error;
  }

  const maskedUrl = process.env.DATABASE_URL.replace(/:([^:]*?)@/, ':****@');
  console.log(`[${timestamp}] 🔌 Database Configuration:`);
  console.log(`[${timestamp}]   - Host: ${maskedUrl.split('@')[1]?.split('/')[0] || 'unknown'}`);
  console.log(`[${timestamp}]   - Database: ${maskedUrl.split('/').pop()?.split('?')[0] || 'unknown'}`);
  console.log(`[${timestamp}] 🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[${timestamp}] ⏳ Initializing database connection pool...`);
};

// Initialize connection with enhanced error handling
logDbConnection();

export const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL,
  // Connection pool settings
  max: 20, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // how long to wait when connecting a new client
});

// Log pool events
pool.on('connect', () => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ✅ Successfully connected to the database`);
  
  // Log pool stats
  pool.query('SELECT NOW() as db_time', (err, res) => {
    if (err) {
      console.error(`[${timestamp}] ❌ Database time check failed:`, err.message);
    } else {
      console.log(`[${timestamp}] 🕒 Database server time:`, res.rows[0].db_time);
    }
  });
});

pool.on('error', (err) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ❌ Unexpected error on idle client:`, err.message);
  console.error(`[${timestamp}] Error details:`, {
    code: err.code,
    stack: err.stack
  });
  // Don't crash the app on connection errors
});

pool.on('acquire', () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔗 Client checked out from the pool');
  }
});

// Initialize Drizzle ORM
export const db = drizzle(pool, { 
  schema,
  logger: process.env.NODE_ENV === 'development' ? {
    logQuery: (query, params) => {
      console.log('📝 Executing query:', query);
      if (params.length > 0) {
        console.log('   Parameters:', params);
      }
    }
  } : false
});

// Test the connection on startup
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Database connection test successful');
    client.release();
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    // Don't throw here to allow the app to continue running
    // The app will fail naturally if it tries to use the database
  }
}

// Run the test connection
testConnection().catch(console.error);
