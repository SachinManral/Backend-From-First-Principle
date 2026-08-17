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
import postmanRouter from './routes/postman.js';
import { initDatabase } from './db/index.js';

dotenv.config();

// Initialize SQLite schema and tables on disk (backend/data/dev.db)
initDatabase();

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
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: "Backend Engineering — First Principles Live Lab API",
    status: "ONLINE",
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    frontendOrigin: FRONTEND_ORIGIN,
    docs: "Hit any /api/demo/* endpoint directly from the browser playground, curl, or Postman.",
    endpoints: {
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

// Mount Utilities & Postman Export Router
app.use('/api', postmanRouter);

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
