import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import echoRouter from './routes/demos/echo.js';
import statusRouter from './routes/demos/status.js';
import corsRouter from './routes/demos/cors.js';
import cacheRouter from './routes/demos/cache.js';
import negotiateRouter from './routes/demos/negotiate.js';
import compressRouter from './routes/demos/compress.js';
import uploadRouter from './routes/demos/upload.js';
import streamRouter from './routes/demos/stream.js';
import idempotencyRouter from './routes/demos/idempotency.js';
import routingRouter from './routes/demos/routing.js';
import serializationRouter from './routes/demos/serialization.js';
import authRouter from './routes/demos/auth.js';
import validationRouter from './routes/demos/validation.js';
import architectureRouter from './routes/demos/architecture.js';
import apiDesignRouter from './routes/demos/apiDesign.js';
import databaseRouter from './routes/demos/database.js';
import chatRouter from './routes/chat.js';
import postmanRouter from './routes/postman.js';
import deviceStateRouter from './routes/deviceState.js';
import { initDatabase, isPostgres, dbQueryOne } from './db/index.js';

dotenv.config();

// Initialize schema and tables on disk / cloud database
initDatabase().catch(err => {
  console.error('[DB INIT ERROR]', err);
});

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

/**
 * ============================================================================
 * FIRST PRINCIPLE: CROSS-ORIGIN RESOURCE SHARING (CORS)
 * Because the frontend runs on http://localhost:3000 and the backend runs on
 * http://localhost:4000, they are legally distinct origins.
 * 
 * Browsers enforce the Same-Origin Policy (SOP). The backend must declare
 * which origins are permitted to read its responses using Access-Control headers.
 * ============================================================================
 */
app.use(cors({
  origin: (origin, callback) => {
    // Allow direct tools (curl, postman, server-to-server) with no origin header
    if (!origin) return callback(null, true);
    // Allow frontend origins (deployed Vercel app, localhost, or custom FRONTEND_ORIGIN)
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-Custom-Header',
    'X-First-Principles-Auth',
    'X-First-Principles-Client',
    'X-Student-Goal',
    'Accept',
    'Accept-Language',
    'Accept-Encoding',
    'If-None-Match',
    'If-Modified-Since'
  ],
  exposedHeaders: [
    'ETag',
    'Last-Modified',
    'Content-Encoding',
    'X-Cache-Decision',
    'X-Raw-Size-Bytes',
    'X-Compressed-Size-Bytes',
    'X-Bandwidth-Savings',
    'X-Preflight-Handled'
  ],
  credentials: false
}));

// Body parsers for JSON and URL-encoded payloads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// First-Principles Request Wire Logger
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[HTTP WIRE] ➔ ${req.method} ${req.originalUrl} | Client IP: ${req.ip || '127.0.0.1'} | Time: ${new Date().toLocaleTimeString()}`);
  next();
});

// Root API Directory & Health Check
app.get('/', async (_req: Request, res: Response) => {
  let dbHealthy = false;
  let totalLikesStored = 0;
  try {
    const row = await dbQueryOne<{ total: string | number }>('SELECT COUNT(*) as total FROM device_likes');
    totalLikesStored = row ? parseInt(String(row.total), 10) : 0;
    dbHealthy = true;
  } catch (err: any) {
    dbHealthy = false;
  }

  res.json({
    name: "Backend Engineering — First Principles Live Lab API",
    status: "ONLINE",
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    database: {
      activeType: isPostgres ? "PostgreSQL (Cloud Persistent)" : "SQLite (Local Ephemeral Disk)",
      isPersistent: isPostgres,
      healthy: dbHealthy,
      totalLikesStored,
      notice: isPostgres
        ? "✅ Connected to Cloud PostgreSQL. Likes & progress are permanently stored."
        : "⚠️ Running on SQLite ephemeral disk. Set DATABASE_URL on Render to prevent resets on redeploy."
    },
    frontendOrigin: FRONTEND_ORIGIN,
    docs: "Hit any /api/demo/* endpoint directly from the browser playground, curl, or Postman.",
    endpoints: {
      dbStatus: "/api/db-status",
      likes: "/api/likes",
      likesStream: "/api/likes/stream",
      echo: "/api/demo/echo",
      status: "/api/demo/status/:code",
      corsSimple: "/api/demo/cors/simple",
      corsPreflight: "/api/demo/cors/preflight",
      cache: "/api/demo/cache/resource",
      negotiate: "/api/demo/negotiate",
      compress: "/api/demo/compress",
      upload: "/api/demo/upload",
      stream: "/api/demo/stream",
      idempotency: "/api/demo/idempotent-check",
      routingStatic: "/api/demo/routing/books",
      routingDynamic: "/api/demo/routing/users/:id",
      routingQuery: "/api/demo/routing/search?query=first-principles",
      routingPagination: "/api/demo/routing/books-paginated?page=1&limit=2",
      routingNested: "/api/demo/routing/users/123/posts/456",
      routingV1: "/api/demo/routing/v1/products",
      routingV2: "/api/demo/routing/v2/products",
      postmanCollection: "/api/export/postman"
    }
  });
});

// Database Diagnostics Endpoint
app.get('/api/db-status', async (_req: Request, res: Response) => {
  let dbHealthy = false;
  let totalLikesStored = 0;
  let totalProgressRecords = 0;
  let error: string | null = null;

  try {
    const likeRow = await dbQueryOne<{ total: string | number }>('SELECT COUNT(*) as total FROM device_likes');
    totalLikesStored = likeRow ? parseInt(String(likeRow.total), 10) : 0;
    const progRow = await dbQueryOne<{ total: string | number }>('SELECT COUNT(*) as total FROM device_progress');
    totalProgressRecords = progRow ? parseInt(String(progRow.total), 10) : 0;
    dbHealthy = true;
  } catch (err: any) {
    dbHealthy = false;
    error = err.message || String(err);
  }

  res.json({
    status: dbHealthy ? "OK" : "ERROR",
    activeDatabase: isPostgres ? "PostgreSQL (Cloud Persistent - Neon/Supabase/Render)" : "SQLite (Local File - Ephemeral)",
    isPersistent: isPostgres,
    databaseUrlProvided: !!(process.env.DATABASE_URL || process.env.POSTGRES_URL),
    totalLikesStored,
    totalProgressRecords,
    error,
    recommendation: isPostgres
      ? "Database is connected to cloud PostgreSQL. Data will persist across all deployments."
      : "DATABASE_URL is missing in environment variables. Add DATABASE_URL in Render Dashboard under 'Environment' to keep likes permanent."
  });
});

// Mount All Live Demo Routers
app.use('/api/demo', echoRouter);
app.use('/api/demo', statusRouter);
app.use('/api/demo', corsRouter);
app.use('/api/demo', cacheRouter);
app.use('/api/demo', negotiateRouter);
app.use('/api/demo', compressRouter);
app.use('/api/demo', uploadRouter);
app.use('/api/demo', streamRouter);
app.use('/api/demo', idempotencyRouter);
app.use('/api/demo', routingRouter);
app.use('/api/demo', serializationRouter);
app.use('/api/demo', authRouter);
app.use('/api/demo/validation', validationRouter);
app.use('/api/demo/architecture', architectureRouter);
app.use('/api/demo/api-design', apiDesignRouter);
app.use('/api/demo/database', databaseRouter);

// Mount AI Chatbot Router
app.use('/api/chat', chatRouter);

// Mount Utilities & Postman Export Router
app.use('/api', postmanRouter);
app.use('/api', deviceStateRouter);

// 404 Handler for Unmatched Paths
app.use((req: Request, res: Response) => {
  res.status(404).json({
    _note: `404 Not Found: The requested path '${req.originalUrl}' does not match any registered Express route.`,
    method: req.method,
    path: req.originalUrl,
    tip: "Inspect the demo catalog at http://localhost:4000/ or import the Postman collection from /api/export/postman."
  });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[UNHANDLED SERVER EXCEPTION]', err);
  res.status(500).json({
    _note: "500 Internal Server Error: An uncaught exception was trapped by the Express error middleware layer.",
    error: err.message || "Internal server error",
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

app.listen(PORT, () => {
  console.log(`\n========================================================`);
  console.log(` 🚀 BACKEND FIRST PRINCIPLES API ONLINE ON PORT ${PORT}`);
  console.log(` 🌐 Live Endpoint: http://localhost:${PORT}`);
  console.log(` 📦 Postman Collection: http://localhost:${PORT}/api/export/postman`);
  console.log(`========================================================\n`);
});

export default app;
