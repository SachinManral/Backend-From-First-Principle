# Backend First Principles — Express API

Standalone Node.js + Express TypeScript backend powering all interactive demos for Sriniously's "Backend Engineering — First Principles" series.

## Features
- **9 Live Demo Endpoints**: Echo (anatomy), Status codes, CORS (simple & preflight), Caching (ETags & 304), Content Negotiation, Gzip Compression, Multipart Uploads, Chunked Streaming (SSE), Idempotency.
- **Deeply Commented Code**: Designed as a learning reference—every file explains the networking / HTTP RFC mechanics.
- **Postman Collection Generator**: Direct export via `GET /api/export/postman`.

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Default config:
```env
PORT=4000
FRONTEND_ORIGIN=http://localhost:3000
```

### 3. Run development server
```bash
npm run dev
```
The API will be live at `http://localhost:4000`.

### 4. Build for production
```bash
npm run build
npm start
```
