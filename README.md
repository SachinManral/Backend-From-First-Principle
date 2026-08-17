# 🚀 Backend, From First Principles

> An open-source, interactive learning platform and real-time backend lab for mastering backend engineering from the ground up, based on **Sriniously's** *"Backend Engineering — First Principles"* series.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org)
[![Express](https://img.shields.io/badge/Express-4.19-lightgrey.svg)](https://expressjs.com)
[![SQLite](https://img.shields.io/badge/SQLite-WAL_Mode-003B57.svg)](https://sqlite.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## 🎯 Purpose & Philosophy

Most backend tutorials jump straight to frameworks, ORMs, and cloud tools without explaining **why** protocols and databases were designed the way they are. 

This repository is built on **First Principles**:
* **Language-Agnostic Understanding**: Understanding raw HTTP wire bytes, TCP sockets, and serialization before choosing Node.js, Go, or Rust.
* **Hands-on Verification**: Every theoretical concept comes with a **live, executable Express endpoint** and on-disk SQLite query.
* **Open Source & Community-Driven**: Built for students, self-taught engineers, and developers preparing for system design interviews to learn, fork, experiment, and contribute back.

---

## ⚡ Quick Start (Run Locally)

### Prerequisites
* **Node.js** v18.0.0 or higher
* **npm** or **pnpm** / **yarn**

### Option A: Run Full Stack (Frontend + Backend Together)
```bash
# 1. Clone the repository
git clone https://github.com/SachinManral/Backend-From-First-Principle.git
cd Backend-From-First-Principle

# 2. Install root dependencies
npm install

# 3. Start both dev servers concurrently
npm run dev
```

* **Frontend Web App**: [http://localhost:3000](http://localhost:3000)
* **Backend Express API**: [http://localhost:4000](http://localhost:4000)

---

### Option B: Run Standalone Services

#### 1. Start the Backend API (Port 4000)
```bash
cd backend
npm install
npm run dev
```
* The SQLite database will automatically initialize in `backend/data/dev.db` with WAL (Write-Ahead Logging) enabled.

#### 2. Start the Frontend Next.js App (Port 3000)
```bash
cd frontend
npm install
npm run dev
```
* Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Architecture & Technical Stack

```
Backend-From-First-Principle/
├── backend/                  # Standalone Express + TypeScript API (Port 4000)
│   ├── data/                 # SQLite Database (dev.db in WAL mode)
│   ├── src/
│   │   ├── db/               # SQLite schema & database connection
│   │   ├── routes/
│   │   │   ├── demos/        # Live interactive demo endpoints (Auth, Routing, CORS, etc.)
│   │   │   ├── deviceState.ts# 1-Like-per-device & anonymous progress synchronization
│   │   │   └── postman.ts    # Dynamic Postman collection export endpoint
│   │   └── index.ts          # Server entry point
│   └── package.json
│
├── frontend/                 # Standalone Next.js 14 App (Port 3000)
│   ├── content/
│   │   └── lectures/         # manifest.json (Single source of truth for lectures)
│   ├── src/
│   │   ├── app/              # Next.js App Router pages (/, /lectures/[slug], /playground, /progress)
│   │   ├── components/       # Reusable UI, Visualizers, and Consoles
│   │   ├── context/          # ProgressContext (Local + SQLite device sync)
│   │   └── lib/              # Demos catalog, types, and helper utilities
│   └── package.json
│
└── README.md
```

### Key Engineering Features:
1. **Per-Device Likes & Anonymous Progress**:
   * Uses persistent UUIDs stored in `localStorage` without requiring user accounts or PII.
   * Guaranteed **1-like-per-device** enforced by SQLite composite primary keys (`PRIMARY KEY (device_id, target_id)`).
   * Background polling synchronizes live community counts in real time.
2. **Interactive API Sandbox (`/playground`)**:
   * 21+ executable endpoints simulating CORS preflight, idempotency checks, JWT signing, and RBAC guards.
   * Generates copyable, production-ready `cURL` commands for every endpoint.
3. **Auto-Complete Navigation**:
   * Moving to the next lesson automatically ticks the previous lecture as completed.

---

## 🤝 How to Contribute (Student & Developer Guide)

This is an **open-source educational project**, and contributions from students and engineers around the world are warmly welcomed!

### Ways You Can Contribute:
* 📝 **Expand Lecture Notes**: Improve explanations, add diagrams, or clarify complex concepts in `frontend/content/lectures/manifest.json`.
* 💻 **Add Code Snippets**: Add equivalent snippets in other backend languages (Python, Java, Rust, Go, C#).
* 🧪 **Build New Playground Demos**: Create new interactive demo routes in `backend/src/routes/demos/` and register them in `frontend/src/lib/demos.ts`.
* 🐛 **Report or Fix Bugs**: Open an issue or fix UI/API bugs across the platform.

### Step-by-Step Contribution Workflow:
1. **Fork** the repository to your GitHub account.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/Backend-From-First-Principle.git
   cd Backend-From-First-Principle
   ```
3. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/lecture-notes-refinement
   ```
4. **Make Your Changes & Test Locally**:
   * Ensure both frontend (`http://localhost:3000`) and backend (`http://localhost:4000`) build with zero errors:
   ```bash
   # In frontend directory
   npm run build
   
   # In backend directory
   npm run build
   ```
5. **Commit Your Changes**:
   ```bash
   git commit -m "docs: expand database indexing notes in lecture 8"
   ```
6. **Push to Your Fork & Open a Pull Request (PR)**:
   ```bash
   git push origin feature/lecture-notes-refinement
   ```
   * Open a PR against the `main` branch with a clear summary of what you improved!

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## ⭐ Support & Community

If you found this learning platform helpful:
* Star ⭐ the repository on GitHub!
* Share it with fellow developers and computer science students.
* Check out [Sriniously's YouTube Channel](https://www.youtube.com/@sriniously) for the complete video series.
