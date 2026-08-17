# 🤝 Contributing to Backend, From First Principles

Thank you for your interest in contributing to **Backend, From First Principles**! This project is an open-source educational platform designed to make backend engineering intuitive and accessible to everyone.

Whether you're fixing a typo, adding multi-language code snippets (Go, Rust, Python, Java), expanding lecture notes, or building interactive demo endpoints — your help is greatly appreciated.

---

## 📋 Code of Conduct

* Be respectful, welcoming, and inclusive to everyone.
* Focus on constructive and clear feedback during PR reviews.
* Keep educational clarity as the top priority.

---

## 🛠️ Local Development Setup

### 1. Fork and Clone
```bash
git clone https://github.com/<your-username>/Backend-From-First-Principle.git
cd Backend-From-First-Principle
```

### 2. Install Dependencies
```bash
# In the root directory (runs npm install for both packages)
npm install
```

### 3. Run Development Servers
```bash
npm run dev
```
* **Frontend Next.js App**: `http://localhost:3000`
* **Backend Express Server**: `http://localhost:4000`

---

## 📂 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── routes/demos/     # Express route handlers for interactive sandbox
│   │   ├── db/               # SQLite database client & schema
│   │   └── index.ts          # Server entry point
│   └── data/                 # Local dev.db (SQLite database)
│
├── frontend/
│   ├── content/lectures/     # manifest.json (Lecture curriculum & notes)
│   ├── src/
│   │   ├── app/              # Next.js App Router pages
│   │   ├── components/       # UI components & interactive consoles
│   │   ├── context/          # State management (Likes, Progress)
│   │   └── lib/demos.ts      # API playground catalog
```

---

## 💡 How to Contribute

### 1. Adding or Refining Lecture Notes
All lecture curriculum content is located in `frontend/content/lectures/manifest.json`.
* You can add missing sections, refine code blocks, or add self-check reflection questions.
* Ensure code snippets use clear syntax highlighting and concise annotations.

### 2. Adding Multi-Language Code Snippets
We aim to show first principles across multiple backend languages (e.g. Node.js, Go, Rust, Python):
* In `manifest.json`, you can expand the `tabs` array of any `code` block to include additional language implementations.

### 3. Adding New Interactive Demo Endpoints
1. Create a new route file in `backend/src/routes/demos/<feature>.ts`.
2. Mount the router in `backend/src/index.ts` under `/api/demo/<feature>`.
3. Register the endpoint configuration in `frontend/src/lib/demos.ts`.

---

## 🚀 Pull Request Guidelines

1. **Create a branch** with a descriptive name:
   ```bash
   git checkout -b feature/expand-lecture-8-rbac
   ```
2. **Test your changes locally** to ensure clean builds:
   ```bash
   cd frontend && npm run build
   cd ../backend && npm run build
   ```
3. **Commit with clean messages**:
   ```bash
   git commit -m "docs: add Go and Rust RBAC examples to lecture 8"
   ```
4. **Push and open a PR** against the `main` branch with a concise explanation of what was changed and why.

Thank you for helping empower the next generation of backend engineers! 🎉
