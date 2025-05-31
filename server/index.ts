import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { domainMiddleware } from "./middleware/domainMiddleware";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import cors, { type CorsOptions, type CorsOptionsDelegate } from "cors";
import { db } from "./db";
import { sql } from "drizzle-orm";

const app = express();

// Configure CORS with type safety
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.NODE_ENV === 'production' 
      ? (process.env.ALLOWED_ORIGINS?.split(',') || [])
      : ['http://localhost:5000', 'http://localhost:3000'];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Request-ID']
} as const;

// Enable CORS for all routes
app.use(cors(corsOptions));

// Log CORS headers for debugging
app.use((req, res, next) => {
  const origin = req.headers.origin || 'no-origin';
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Origin: ${origin}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    const result = await db.execute(sql`SELECT 1 as test`);
    
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
      render: process.env.RENDER === 'true',
      node_env: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Add domain routing middleware
app.use(domainMiddleware);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Create WebSocket server
  const wss = new WebSocketServer({ 
    server,
    path: "/v2"
  });

  // Add CORS verification for WebSocket
  wss.on('headers', (headers, req) => {
    const origin = req.headers.origin;
    const allowedOrigins = process.env.NODE_ENV === 'production'
      ? process.env.ALLOWED_ORIGINS?.split(',')
      : ['http://localhost:5000', 'http://localhost:3000'];
    
    if (origin && allowedOrigins?.includes(origin)) {
      headers.push('Access-Control-Allow-Origin', origin);
      headers.push('Access-Control-Allow-Credentials', 'true');
    }
  });

  wss.on('connection', (ws, req) => {
    console.log('WebSocket client connected from:', req.socket.remoteAddress);
    
    ws.on('message', (message) => {
      console.log('Received:', message.toString());
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error(`Error: ${err.stack || err.message || err}`);
    res.status(status).json({ message });
  });

  // Setup Vite in development
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Start server function
  const startServer = (port: number) => {
    const timestamp = new Date().toISOString();
    const server = createServer(app);
    
    server.listen(port, () => {
      console.log(`\n=== Server Startup [${new Date().toISOString()}] ===`);
      console.log(`✅ Server is running on port ${port}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📧 Email verification: ${process.env.SMTP_HOST ? 'Enabled' : 'Disabled'}`);
      
      if (process.env.SMTP_HOST) {
        console.log(`   - SMTP Host: ${process.env.SMTP_HOST}`);
        console.log(`   - SMTP Port: ${process.env.SMTP_PORT || '587'}`);
      }
      
      console.log(`🔗 Database: ${process.env.DATABASE_URL ? 'Configured' : 'Not configured'}`);
      if (process.env.DATABASE_URL) {
        const maskedUrl = process.env.DATABASE_URL.replace(/:([^:]*?)@/, ':****@');
        console.log(`   - Host: ${maskedUrl.split('@')[1]?.split('/')[0] || 'unknown'}`);
        console.log(`   - Database: ${maskedUrl.split('/').pop()?.split('?')[0] || 'unknown'}`);
      }
      
      console.log(`🌍 Allowed Origins: ${process.env.ALLOWED_ORIGINS || 'Not set'}`);
      console.log('===================================');
      console.log(`[${new Date().toISOString()}] 🚀 Server ready to accept connections`);
    });

    // Handle server errors
    server.on('error', (error: NodeJS.ErrnoException) => {
      const timestamp = new Date().toISOString();
      console.error(`\n[${timestamp}] ❌ Server error:`, error.message);
      if (error.code === 'EADDRINUSE') {
        console.error(`[${timestamp}] ⚠️  Port ${port} is already in use`);
        console.log(`[${timestamp}] Trying port ${port + 1}...`);
        startServer(port + 1);
      } else {
        process.exit(1);
      }
    });

    return server;
  };
  
  // Start the server
  startServer(5000);
})();
