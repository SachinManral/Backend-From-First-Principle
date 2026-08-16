# Backend First Principles — Web Hub & 3D Interactive Lab

Standalone Next.js 14 frontend and 3D interactive learning platform for Sriniously's "Backend Engineering — First Principles" series.

## Features
- **4-Zone Consistent Lecture Architecture**:
  1. TL;DR (Core takeaway)
  2. Structured Notes (Clean, simple-worded first principles, tables, cards)
  3. Interactive 3D / Animated Visualizers (Request Journey, CORS Preflight, HTTP Caching 304)
  4. Practical Playground Panel (Live in-browser request fire, response inspector, copyable `curl`, Postman collection download)
- **Zero-Code Lecture Growth**: Drop a JSON lecture file into `content/lectures/` to automatically register new lectures in the sidebar, progress tracker, and playground.
- **Global Playground Hub**: Test all 9 backend endpoints in one interface (`/playground`).
- **Progress Tracker**: LocalStorage-persisted lecture completion tracker (`/progress`).

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
```
Make sure `NEXT_PUBLIC_API_URL` points to your backend server:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
