import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "../shared/schema";
import { Pool, PoolClient } from 'pg';

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}`;
  console.error('❌', errorMessage);
  throw new Error(errorMessage);
}

// Mask sensitive information in connection string for logging
const maskConnectionString = (connectionString: string): string => {
  try {
    const url = new URL(connectionString);
    if (url.password) {
      url.password = '****';
    }
    return url.toString();
  } catch (error) {
    return 'Invalid connection string';
  }
};

// Connection pool configuration
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  max: 20, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection could not be established
  maxUses: 7500, // close (and replace) a connection after it has been used this many times
};

// Create the pool
const pool = new Pool(poolConfig);

// Log connection events
pool.on('connect', (client: PoolClient) => {
  console.log('🔌 New database connection established');
  
  // Set a timeout to log long-running queries
  const queryStartTime = Date.now();
  const timeout = setTimeout(() => {
    console.warn('⚠️  Long-running query detected (over 10s)');
  }, 10000);

  // Listen for query events
  const originalQuery = client.query;
  client.query = (...args: any[]) => {
    const start = Date.now();
    return originalQuery.apply(client, args as any)
      .then((res: any) => {
        const duration = Date.now() - start;
        clearTimeout(timeout);
        if (duration > 200) { // Log slow queries
          console.log(`🐌 Slow query (${duration}ms):`, args[0]?.text || args[0]);
        }
        return res;
      })
      .catch((err: any) => {
        clearTimeout(timeout);
        console.error('❌ Database query error:', err.message);
        throw err;
      });
  };
});

pool.on('error', (err: Error) => {
  console.error('❌ Unexpected error on idle database client', err);
  // Don't exit the process, let the pool handle reconnection
});

// Test the database connection on startup
async function testConnection() {
  const client = await pool.connect();
  try {
    const start = Date.now();
    await client.query('SELECT 1');
    const duration = Date.now() - start;
    console.log(`✅ Database connection successful (${duration}ms)`);
    
    // Log database version
    const versionResult = await client.query('SELECT version()');
    console.log(`   Database: ${versionResult.rows[0]?.version || 'Unknown version'}`);
    
    // Log current database name and user
    const dbInfo = await client.query('SELECT current_database(), current_user, inet_server_addr() as host, inet_server_port() as port');
    const db = dbInfo.rows[0];
    console.log(`   Connected to: ${db.current_database}@${db.host}:${db.port} as ${db.current_user}`);
    
  } catch (err) {
    console.error('❌ Database connection failed:', (err as Error).message);
    throw err;
  } finally {
    client.release();
  }
}

// Test connection immediately and log results
testConnection().catch(console.error);

export { pool };
export const db = drizzle(pool, { 
  schema,
  logger: {
    logQuery: (query: string, params: any[]) => {
      // Only log in development or if explicitly enabled
      if (process.env.NODE_ENV === 'development' || process.env.DB_QUERY_LOGGING === 'true') {
        console.log('📝 Query:', query);
        if (params?.length) console.log('   Params:', params);
      }
    }
  }
});