import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { domainMiddleware } from "./middleware/domainMiddleware";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import cors from "cors";

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') 
    : ['http://localhost:5000', 'http://localhost:3000','http://uv-new-motk.vercel.app' ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add domain routing middleware
app.use(domainMiddleware);

// Add a simple database check endpoint
app.get('/api/simple-db-check', async (req, res) => {
  try {
    console.log('Simple DB Check - Request received');
    const maskedDbUrl = process.env.DATABASE_URL 
      ? process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@')
      : 'Not set';
    console.log('Simple DB Check - DATABASE_URL:', maskedDbUrl);
    
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({
        error: 'DATABASE_URL is not set in environment variables',
        message: 'Please check your server configuration',
        timestamp: new Date().toISOString()
      });
    }

    // Import database modules directly
    const { db, pool } = require('./db');
    const { users } = require('../shared/schema');
    
    try {
      // Check database connection with a simple query
      const client = await pool.connect();
      const dbUsers = await db.select().from(users).limit(5);
      client.release();
      
      return res.status(200).json({
        message: 'Database check completed successfully',
        database: {
          connected: true,
          url: maskedDbUrl,
          userCount: dbUsers.length,
          users: dbUsers.map((u: any) => ({ 
            id: u.id, 
            email: u.email, 
            role: u.role,
            createdAt: u.createdAt
          }))
        },
        timestamp: new Date().toISOString(),
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          DATABASE_URL: process.env.DATABASE_URL ? 'Set (hidden)' : 'Not set',
          VERCEL: process.env.VERCEL ? 'true' : 'false',
          RENDER: process.env.RENDER ? 'true' : 'false'
        }
      });
    } catch (error: any) {
      console.error('Database check failed:', error);
      return res.status(500).json({
        error: 'Database connection failed',
        message: error?.message || 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error: any) {
    console.error('Simple DB Check - Error:', error);
    return res.status(500).json({
      message: 'Database check failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

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
    path: "/v2",
    // Enable CORS for WebSocket
    verifyClient: (info, callback) => {
      const origin = info.origin || info.req.headers.origin;
      const allowedOrigins = process.env.NODE_ENV === 'production'
        ? process.env.ALLOWED_ORIGINS?.split(',')
        : ['http://localhost:5000', 'http://localhost:3000'];
      
      if (!origin || allowedOrigins?.includes(origin)) {
        callback(true);
      } else {
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

  // Start server
  const startServer = (port: number) => {
    server.listen(port, () => {
      log(`Server running on port ${port}`);
      log(`WebSocket server available at ws://localhost:${port}/v2`);
    }).on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        log(`Port ${port} is in use, trying port ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error("Server error:", err);
      }
    });
  };
  
  startServer(5000);
})();
