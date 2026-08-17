import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store database file on disk in backend/data/dev.db
const dataDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'dev.db');
const db = new Database(dbPath, { verbose: process.env.NODE_ENV === 'test' ? undefined : undefined });

/**
 * ============================================================================
 * FIRST PRINCIPLE: RELATIONAL DATABASE INTERNALS & PRAGMAS
 * 
 * 1. Write-Ahead Logging (WAL):
 *    Instead of locking the entire database during a write, writes are appended
 *    to a separate WAL file, allowing concurrent readers without contention.
 * 
 * 2. Foreign Keys:
 *    SQLite disables foreign key enforcement by default for backward compatibility.
 *    We enable it to enforce relational consistency.
 * ============================================================================
 */
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  // 1. Create Schema Tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL DEFAULT 'Engineer',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT,
      views INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      price REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      sku TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS idempotency_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item TEXT NOT NULL,
      action TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Seed Initial Records if empty
  const bookCount = db.prepare('SELECT COUNT(*) as count FROM books').get() as { count: number };
  if (bookCount.count === 0) {
    const insertBook = db.prepare('INSERT INTO books (title, author) VALUES (?, ?)');
    insertBook.run("Designing Data-Intensive Applications", "Martin Kleppmann");
    insertBook.run("Computer Networking: A Top-Down Approach", "Kurose & Ross");
    insertBook.run("Operating Systems: Three Easy Pieces", "Arpaci-Dusseau");
    insertBook.run("Database Internals", "Alex Petrov");
    insertBook.run("System Design Interview", "Alex Xu");
  }

  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    const insertUser = db.prepare('INSERT INTO users (id, name, email, role) VALUES (?, ?, ?, ?)');
    insertUser.run(123, "Sachin Manral", "sachin@example.com", "Backend Engineer");
    insertUser.run(456, "Alex Rivera", "alex@example.com", "Distributed Systems Architect");
  }

  const postCount = db.prepare('SELECT COUNT(*) as count FROM posts').get() as { count: number };
  if (postCount.count === 0) {
    const insertPost = db.prepare('INSERT INTO posts (id, user_id, title, content, views) VALUES (?, ?, ?, ?, ?)');
    insertPost.run(456, 123, "Why First-Principles Thinking Matters in Backend", "Mastering the underlying mechanics transforms architecture.", 1420);
    insertPost.run(457, 123, "Understanding Connection Pooling & Sockets", "Multiplexing client queries over limited TCP sockets.", 890);
  }

  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if (productCount.count === 0) {
    const insertProduct = db.prepare('INSERT INTO products (name, title, price, currency, sku) VALUES (?, ?, ?, ?, ?)');
    insertProduct.run("Mechanical Keyboard", "Mechanical Keyboard", 120.00, "USD", "KB-MECH-01");
    insertProduct.run("4K IPS Monitor", "4K IPS Monitor", 450.00, "USD", "DISP-4K-02");
    insertProduct.run("Ergonomic Chair", "Ergonomic Chair", 350.00, "USD", "FURN-CHAIR-03");
  }

  console.log(`[SQLITE DB] 📦 Initialized persistent disk database at: ${dbPath}`);
}

export default db;
