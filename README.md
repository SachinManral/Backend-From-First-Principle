<div align="center">

# Backend, From First Principles

An open-source interactive learning platform and real-time backend lab designed to teach core backend engineering concepts from first principles.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg?logo=next.js)](https://nextjs.org)
[![Express](https://img.shields.io/badge/Express-4.19-lightgrey.svg?logo=express)](https://expressjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg?logo=typescript)](https://www.typescriptlang.org)
[![SQLite](https://img.shields.io/badge/SQLite-WAL_Mode-003B57.svg?logo=sqlite)](https://sqlite.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

</div>

---

## 📌 Overview

**Backend, From First Principles** bridges the gap between high-level web frameworks and underlying systems engineering. Rather than treating backend infrastructure as a black box, this platform breaks down how requests travel across networks, how protocols structure data over the wire, and how databases persist state.

Inspired by Sriniously's *"Backend Engineering — First Principles"* series, every lecture includes:
- **Foundational Theory**: Protocol mechanics, RFC standards, and architectural trade-offs.
- **Language-Agnostic Implementations**: Code examples in TypeScript, Go, and Rust.
- **Live Interactive Sandbox**: Real-time Express endpoints and SQLite operations executable directly from the browser.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org) (App Router, Server & Client Components)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) (Custom dark design system)
- **Icons**: [Lucide React](https://lucide.dev)

### Backend
- **Server**: [Express](https://expressjs.com) on Node.js
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Database**: [SQLite](https://sqlite.org) (`better-sqlite3` with Write-Ahead Logging)
- **Security & Crypto**: Native Node.js `crypto` (HMAC-SHA256, timing attack mitigations)

---

## ⚡ Quick Start

### Prerequisites
- [Node.js](https://nodejs.org) (v18.0.0 or higher)
- [npm](https://www.npmjs.com) (or `pnpm` / `yarn`)

### 1. Clone the Repository
```bash
git clone https://github.com/SachinManral/Backend-From-First-Principle.git
cd Backend-From-First-Principle
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Servers
Start both the Next.js frontend and Express backend concurrently:
```bash
npm run dev
```

* **Frontend Web App**: [http://localhost:3000](http://localhost:3000)
* **Backend API Server**: [http://localhost:4000](http://localhost:4000)

---

## 📂 Project Structure

```
Backend-From-First-Principle/
├── backend/
│   ├── data/                 # SQLite database storage (dev.db in WAL mode)
│   ├── src/
│   │   ├── db/               # SQLite database client and schema definitions
│   │   ├── routes/
│   │   │   ├── demos/        # Interactive demo routers (Auth, Routing, CORS, etc.)
│   │   │   ├── deviceState.ts# Anonymous device progress & likes sync
│   │   │   └── postman.ts    # Dynamic Postman collection exporter
│   │   └── index.ts          # Express application entry point
│   └── package.json
│
├── frontend/
│   ├── content/
│   │   └── lectures/         # manifest.json (Lecture notes, code blocks, takeaways)
│   ├── src/
│   │   ├── app/              # Next.js App Router routes & layouts
│   │   ├── components/       # Reusable UI components, visualizers & sandboxes
│   │   ├── context/          # Global application state (ProgressContext)
│   │   └── lib/              # Demos catalog, helper utilities, and TypeScript types
│   └── package.json
│
├── CONTRIBUTING.md           # Contribution guide for students & developers
├── LICENSE                   # MIT License
└── package.json              # Root workspace management
```

---

## 💻 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts both backend (`:4000`) and frontend (`:3000`) concurrently |
| `npm run dev:backend` | Starts only the Express backend development server |
| `npm run dev:frontend` | Starts only the Next.js frontend development server |
| `npm run build` | Builds both backend and frontend for production |
| `npm run install:all` | Installs dependencies across both packages |

---

## 🤝 Contributing

Contributions are welcome from students and developers of all skill levels. Whether you want to improve lecture notes, add multi-language code snippets (Go, Rust, Python), or build new backend sandbox endpoints, check out the [Contributing Guide](CONTRIBUTING.md) to get started.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
