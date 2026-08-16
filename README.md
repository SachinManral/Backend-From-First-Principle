# Backend, First Principles — Learning Hub & Live Lab

A full-stack, dark-themed learning platform and interactive lab for Sriniously's **"Backend Engineering — First Principles"** YouTube course.

This repository is structured into two completely independent, decoupled projects:
- **`backend/`** — Standalone Node.js + Express TypeScript API running on `http://localhost:4000`, containing heavily-commented demo routes for all 9 practical endpoints + Postman collection generator.
- **`frontend/`** — Standalone Next.js 14 + Tailwind CSS + Three.js app running on `http://localhost:3000`, containing 4-zone lecture templates, interactive 3D visualizers, and practical playground consoles.

---

## Quick Start

### Option A: Run Both Together
You can run both concurrently from the root directory:
```bash
npm install
npm run dev
```

### Option B: Run Independently (Real Deployed Setup)

#### 1. Start the Backend API (Port 4000)
```bash
cd backend
npm install
npm run dev
```
API endpoints will be live at `http://localhost:4000`.

#### 2. Start the Frontend App (Port 3000)
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4-Zone Lecture Architecture

Each lecture is organized into four consistent, focused zones:
1. **Zone 1: TL;DR** — Concise 1–2 line core takeaway with rule summary.
2. **Zone 2: Structured Notes** — Clean explanations, comparison tables, code snippets, and key first principles.
3. **Zone 3: Visualize It** — Interactive 3D/animated visualizer:
   - **Request Journey (Lecture 3)**: 6-hop packet flow (Browser ➔ DNS ➔ Firewall ➔ Host ➔ Nginx ➔ Express App) with inspection of ports, sockets, and TLS termination.
   - **CORS Preflight (Lecture 5)**: Step-by-step OPTIONS handshake, header inspection, and allowed vs blocked verdict.
   - **HTTP Caching & ETags (Lecture 5)**: Fresh 200 OK vs 304 Not Modified 0-byte transfer and PATCH mutation.
4. **Zone 4: Try It Yourself (Practical Playground)** — Live in-browser request fire panel, raw request/response side-by-side inspector, copyable `curl`, and Postman export.

---

## 9 Live Interactive Demo Endpoints

All live endpoints are implemented with detailed teaching comments in `backend/src/routes/demos/`:

| Concept | Endpoint | Description |
|---|---|---|
| **Request Anatomy** | `ANY /api/demo/echo` | Echoes method, headers, query params, and body |
| **Status Codes** | `GET /api/demo/status/:code` | Realistic bodies for 200, 201, 204, 301, 302, 304, 400, 401, 403, 404, 409, 500, 503, 504 |
| **CORS** | `GET /api/demo/cors/simple`<br>`PUT /api/demo/cors/preflight` | Access-Control toggle to test both allowed and blocked browser flows |
| **HTTP Caching** | `GET /api/demo/cache/resource`<br>`PATCH /api/demo/cache/resource` | ETag and `Cache-Control` validation with 304 Not Modified |
| **Content Negotiation** | `GET /api/demo/negotiate` | Adapts format (JSON/XML/Text) and language (en/es/hi/fr) based on `Accept` headers |
| **Compression** | `GET /api/demo/compress` | Gzip active vs uncompressed size comparison (~85% reduction) |
| **Multipart Upload** | `POST /api/demo/upload` | Parses `multipart/form-data` with boundaries and file metadata |
| **Chunked Streaming** | `GET /api/demo/stream` | Server-Sent Events (`text/event-stream`) streaming progress chunks |
| **Idempotency** | `GET/PUT/POST/DELETE /api/demo/idempotent-check` | Proves state change characteristics of safe vs idempotent methods |

---

## How to Add Lecture 6, 7, 8... (Zero App Code Changes)

To add a new lecture in the future:
1. Drop a new JSON file into `frontend/content/lectures/NN-slug.json`.
2. Add its entry to `frontend/content/lectures/manifest.json`.
3. (Optional) If it needs a new backend endpoint, add a route file in `backend/src/routes/demos/`.

The sidebar, progress tracker, and global playground will update **automatically**!
