import { Pool } from 'pg';

async function testConnection() {
  // Use the provided Neon database connection string
  const connectionString = 'postgresql://neondb_owner:npg_MgD6I0eNokLv@ep-lucky-rice-a57yzbrw-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require';
  
  if (!connectionString) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('Attempting to connect to database...');
  console.log('Connection string:', connectionString.replace(/:([^:]*?)@/, ':****@'));

  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false // For development only, not recommended for production
    }
  });

  try {
    // Test the connection
    const client = await pool.connect();
    console.log('✅ Successfully connected to the database');
    
    // Try a simple query
    console.log('\nRunning test query...');
    const result = await client.query('SELECT version()');
    console.log('✅ Database version:', result.rows[0].version);
    
    // Check if users table exists
    try {
      const tables = await client.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
      );
      console.log('\nAvailable tables:', tables.rows.map((r: any) => r.table_name).join(', '));
      
      if (tables.rows.some((r: any) => r.table_name === 'users')) {
        const users = await client.query('SELECT COUNT(*) as count FROM users');
        console.log('✅ Users table exists with', users.rows[0].count, 'users');
      }
    } catch (err) {
      console.log('ℹ️ Could not query tables (this might be normal if no tables exist yet)');
    }
    
    client.release();
  } catch (err) {
    console.error('❌ Failed to connect to the database');
    console.error('Error details:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testConnection().catch(console.error);
