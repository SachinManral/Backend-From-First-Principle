# 🤝 Contributing to Backend, From First Principles

Thank you for your interest in contributing! **Backend, From First Principles** is an open-source educational platform designed to make backend engineering intuitive, deep, and accessible to everyone.

We welcome contributions of all kinds — from correcting typos and refining notes to adding new multi-language code snippets and building interactive demo endpoints.

---

## 🧭 Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment. Please treat all contributors with respect and maintain a constructive, educational focus in all discussions and pull request reviews.

---

## 🛠️ Local Development Setup

### 1. Prerequisites
Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org) (v18.0.0 or higher)
* [Git](https://git-scm.com)
* [npm](https://www.npmjs.com) (or `pnpm` / `yarn`)

### 2. Fork & Clone
1. Fork the repository to your own GitHub account.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/Backend-From-First-Principle.git
   cd Backend-From-First-Principle
   ```

### 3. Install Dependencies
Install all root, frontend, and backend dependencies:
```bash
npm run install:all
```

### 4. Run Development Servers
Start both the frontend and backend servers concurrently:
```bash
npm run dev
```

* **Frontend**: [http://localhost:3000](http://localhost:3000)
* **Backend**: [http://localhost:4000](http://localhost:4000)

---

## 💡 Ways to Contribute

### 1. Refining Lecture Notes
All lecture curriculum content is located in [`frontend/content/lectures/manifest.json`](frontend/content/lectures/manifest.json).
* Clarify explanations or add architectural mental models.
* Add self-check reflection questions for students.
* Ensure all technical explanations adhere to first principles.

### 2. Adding Multi-Language Code Snippets
We aim to demonstrate concepts across multiple systems languages (e.g. Node.js/TypeScript, Go, Rust, Python, Java):
* In `manifest.json`, you can expand the `tabs` array of any `code` block to include additional language implementations.

### 3. Building Interactive Sandbox Demos
1. Create a new route handler in [`backend/src/routes/demos/`](backend/src/routes/demos/).
2. Mount the router in [`backend/src/index.ts`](backend/src/index.ts) under `/api/demo/<feature>`.
3. Register the endpoint definition in [`frontend/src/lib/demos.ts`](frontend/src/lib/demos.ts).

---

## 🌿 Git Workflow & Pull Request Process

### 1. Create a Branch
Always branch off the `main` branch with a descriptive branch name:
```bash
git checkout -b feat/add-rust-rbac-snippet
# or
git checkout -b fix/typo-lecture-06
```

### 2. Verify Your Changes
Make sure both packages build cleanly without TypeScript or runtime errors:
```bash
# Build backend
npm run build --prefix backend

# Build frontend
npm run build --prefix frontend
```

### 3. Commit Guidelines
Use clear, conventional commit messages:
* `feat:` A new feature, demo endpoint, or visualizer.
* `docs:` Documentation updates, lecture note refinements, or comment improvements.
* `fix:` Bug fixes in API endpoints or UI components.
* `refactor:` Code restructuring without functional changes.

Example:
```bash
git commit -m "docs: clarify constant-time timing attack mitigation in lecture 8"
```

### 4. Open a Pull Request
1. Push your branch to your GitHub fork:
   ```bash
   git push origin feat/add-rust-rbac-snippet
   ```
2. Open a Pull Request against the `main` branch of the upstream repository.
3. Provide a clear summary of your changes, referencing any relevant issues or lecture numbers.

---

## 📄 License

By contributing to this repository, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
