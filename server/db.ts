import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "../shared/schema";

// Enhanced database connection logging
const logDbConnection = () => {
  if (!process.env.DATABASE_URL) {
    const error = new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?"
    );
    console.error('❌ Database connection error:', error.message);
    throw error;
  }

  const maskedUrl = process.env.DATABASE_URL.replace(/:([^:]*?)@/, ':****@');
  console.log(`🔌 Attempting to connect to PostgreSQL at: ${maskedUrl}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
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
  console.log('✅ Successfully connected to the database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
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
