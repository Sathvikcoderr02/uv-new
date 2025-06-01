import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { domainMiddleware } from "./middleware/domainMiddleware";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import cors from "cors";
import { db } from "./db";
import { sql } from "drizzle-orm";
import path from 'path';

const app = express();

// Initialize the application
(async () => {
  console.log('=== Starting server initialization ===');
  
  // Log environment
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('PORT:', process.env.PORT);
  
  // Mount API routes from api-server
  try {
    const apiServerPath = path.join(__dirname, '../api-server/index.js');
    const { app: apiApp } = await import(apiServerPath);
    app.use('/api', apiApp);
    console.log('API routes mounted at /api');
  } catch (error) {
    console.error('Failed to mount API routes:', error);
  }
  
  // Test route - should be accessible without any middleware
  console.log('Registering test route at /test-route');
  app.get('/test-route', (req, res) => {
    console.log('Test route hit!');
    res.json({ 
      status: 'ok',
      message: 'Test route is working!',
      timestamp: new Date().toISOString()
    });
  });
  
  // Log all registered routes for debugging
  console.log('=== Registered Routes ===');
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      console.log(`${Object.keys(middleware.route.methods).join(', ').toUpperCase()} -> ${middleware.route.path}`);
    }
  });
  console.log('=========================');

  // Request logging middleware
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });

  // Enable CORS for all routes
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? [
          ...(process.env.ALLOWED_ORIGINS?.split(',') || []),
          'https://uv-new.vercel.app'
        ].filter(Boolean)
      : [
          'http://localhost:5000',
          'http://localhost:3000',
          'http://uv-new.vercel.app',
          'https://uv-new.vercel.app',
          'http://uv-new-motk.vercel.app',
          'https://uv-new-motk.vercel.app'
        ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Parse JSON and URL-encoded bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Request logging middleware
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

  // Register all routes (API, debug, etc.)
  const server = await registerRoutes(app);

  // Add domain routing middleware - must be after API routes
  app.use(domainMiddleware);

  // Create WebSocket server
  const wss = new WebSocketServer({ 
    server,
    path: "/v2",
    // Enable CORS for WebSocket
    verifyClient: (info, callback) => {
      const origin = info.origin || info.req.headers.origin;
      const allowedOrigins = process.env.NODE_ENV === 'production'
        ? [
            ...(process.env.ALLOWED_ORIGINS?.split(',') || []),
            'https://uv-new.vercel.app',
            'https://uv-new-motk.vercel.app',
            'https://uv-new-1.onrender.com'
          ].filter(Boolean)
        : [
            'http://localhost:5000',
            'http://localhost:3000',
            'http://uv-new.vercel.app',
            'https://uv-new.vercel.app',
            'http://uv-new-motk.vercel.app',
            'https://uv-new-motk.vercel.app',
            'http://uv-new-1.onrender.com',
            'https://uv-new-1.onrender.com'
          ];
      
      if (!origin || allowedOrigins.includes(origin)) {
        console.log(`WebSocket connection allowed from: ${origin}`);
        callback(true);
      } else {
        console.warn(`WebSocket connection rejected from: ${origin}`);
        callback(false, 403, 'Forbidden');
      }
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

  // Function to test database connection
  async function testDatabaseConnection() {
    try {
      console.log('Testing database connection...');
      const startTime = Date.now();
      const result = await db.execute(sql`SELECT 1 as test`);
      const duration = Date.now() - startTime;
      
      console.log('✅ Database connection successful!');
      console.log(`   Query executed in ${duration}ms`);
      console.log(`   Database URL: ${process.env.DATABASE_URL ? 'Set (hidden for security)' : 'Not set'}`);
      
      // Log database version
      try {
        const dbVersion = await db.execute(sql`SELECT version()`);
        console.log(`   Database version: ${dbVersion.rows[0]?.version || 'Unknown'}`);
      } catch (versionError) {
        console.log('   Could not retrieve database version');
      }
      
      return true;
    } catch (error) {
      console.error('❌ Database connection failed!');
      console.error('   Error:', error instanceof Error ? error.message : 'Unknown error');
      console.log('   DATABASE_URL:', process.env.DATABASE_URL ? 'Set (hidden for security)' : 'Not set');
      return false;
    }
  }

  // Start server
  const startServer = async (port: number) => {
    const server = createServer(app);
    
    // Test database connection before starting server
    const dbConnected = await testDatabaseConnection();
    
    // Log email configuration
    if (process.env.EMAIL_HOST) {
      console.log(`📧 Email verification enabled with SMTP server: ${process.env.EMAIL_HOST}`);
    } else {
      console.warn('⚠️  Email verification is DISABLED - EMAIL_HOST not set');
    }
    
    // Log storage configuration
    console.log(`💾 Storage type: ${process.env.STORAGE_TYPE || 'local'}`);
    
    // Log environment
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🚀 Server starting on port ${port}...`);
    
    server.listen(port, () => {
      console.log(`✅ Server is running on port ${port}`);
      console.log(`   Current time: ${new Date().toISOString()}`);
      console.log(`   Node.js version: ${process.version}`);
      console.log(`   Platform: ${process.platform} ${process.arch}`);
      console.log(`   Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
      
      if (!dbConnected) {
        console.warn('⚠️  WARNING: Server started WITHOUT database connection!');
      }
    });
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      // Don't exit immediately, give time to log the error
      setTimeout(() => process.exit(1), 1000);
    });
    
    return server;
  };

  // Start the server
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  startServer(PORT).catch(error => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  });
})();
