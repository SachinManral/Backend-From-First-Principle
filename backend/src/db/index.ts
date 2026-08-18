import 'dotenv/config';
import Database from 'better-sqlite3';
import pg from 'pg';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
export const isPostgres = !!databaseUrl;

let pgPool: pg.Pool | null = null;
let sqliteDb: InstanceType<typeof Database> | null = null;

// Always initialize local SQLite fallback so synchronous demo routes never crash
const dataDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'dev.db');
sqliteDb = new Database(dbPath, { verbose: process.env.NODE_ENV === 'test' ? undefined : undefined });
sqliteDb.pragma('journal_mode = WAL');
sqliteDb.pragma('foreign_keys = ON');

if (isPostgres) {
  console.log('[DATABASE] 🐘 Connecting to Cloud PostgreSQL (Neon / Supabase / Render / Railway)...');
  pgPool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' || databaseUrl?.includes('sslmode=require') || databaseUrl?.includes('neon.tech') || databaseUrl?.includes('supabase')
      ? { rejectUnauthorized: false }
      : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });
} else {
  console.log(`[SQLITE DB] 📦 Initialized local SQLite at: ${dbPath}`);
}

/**
 * Universal query runner: Converts '?' placeholders to PostgreSQL '$1, $2' when in Postgres mode.
 */
function convertPlaceholders(sql: string): string {
  let index = 1;
  return sql.replace(/\?/g, () => `$${index++}`);
}

export async function dbQuery<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  if (isPostgres && pgPool) {
    const pgSql = convertPlaceholders(sql);
    const result = await pgPool.query(pgSql, params);
    return result.rows as T[];
  } else if (sqliteDb) {
    const stmt = sqliteDb.prepare(sql);
    return stmt.all(...params) as T[];
  }
  return [];
}

export async function dbQueryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  if (isPostgres && pgPool) {
    const pgSql = convertPlaceholders(sql);
    const result = await pgPool.query(pgSql, params);
    return (result.rows[0] as T) || null;
  } else if (sqliteDb) {
    const stmt = sqliteDb.prepare(sql);
    const row = stmt.get(...params);
    return (row as T) || null;
  }
  return null;
}

export async function dbExecute(sql: string, params: any[] = []): Promise<{ rowCount: number; lastInsertRowid?: number | bigint }> {
  if (isPostgres && pgPool) {
    const pgSql = convertPlaceholders(sql);
    const result = await pgPool.query(pgSql, params);
    return { rowCount: result.rowCount || 0 };
  } else if (sqliteDb) {
    const stmt = sqliteDb.prepare(sql);
    const result = stmt.run(...params);
    return { rowCount: result.changes, lastInsertRowid: result.lastInsertRowid };
  }
  return { rowCount: 0 };
}

export async function initDatabase(): Promise<void> {
  if (isPostgres && pgPool) {
    await initPostgresSchema();
  } else if (sqliteDb) {
    initSqliteSchema();
  }
}

function initSqliteSchema() {
  if (!sqliteDb) return;

  sqliteDb.exec(`
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

    CREATE TABLE IF NOT EXISTS device_likes (
      device_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (device_id, target_id)
    );

    CREATE TABLE IF NOT EXISTS device_progress (
      device_id TEXT PRIMARY KEY,
      completed_slugs TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default platform likes if empty
  const likeCount = sqliteDb.prepare('SELECT COUNT(*) as count FROM device_likes').get() as { count: number };
  if (likeCount.count === 0) {
    const insertLike = sqliteDb.prepare('INSERT OR IGNORE INTO device_likes (device_id, target_id) VALUES (?, ?)');
    insertLike.run('device-seed-1', 'platform-root');
    insertLike.run('device-seed-2', 'platform-root');
    insertLike.run('device-seed-3', 'platform-root');
    insertLike.run('device-seed-1', '01-roadmap');
    insertLike.run('device-seed-2', '01-roadmap');
    insertLike.run('device-seed-1', '03-what-is-a-backend');
    insertLike.run('device-seed-3', '05-http-protocol');
    insertLike.run('device-seed-1', '06-backend-routing');
    insertLike.run('device-seed-2', '06-backend-routing');
  }

  // Seed Books
  const bookCount = sqliteDb.prepare('SELECT COUNT(*) as count FROM books').get() as { count: number };
  if (bookCount.count === 0) {
    const insertBook = sqliteDb.prepare('INSERT INTO books (title, author) VALUES (?, ?)');
    insertBook.run("Designing Data-Intensive Applications", "Martin Kleppmann");
    insertBook.run("Computer Networking: A Top-Down Approach", "Kurose & Ross");
    insertBook.run("Operating Systems: Three Easy Pieces", "Arpaci-Dusseau");
    insertBook.run("Database Internals", "Alex Petrov");
    insertBook.run("System Design Interview", "Alex Xu");
  }

  const userCount = sqliteDb.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    const insertUser = sqliteDb.prepare('INSERT INTO users (id, name, email, role) VALUES (?, ?, ?, ?)');
    insertUser.run(123, "Sachin Manral", "sachin@example.com", "Backend Engineer");
    insertUser.run(456, "Alex Rivera", "alex@example.com", "Distributed Systems Architect");
  }

  const postCount = sqliteDb.prepare('SELECT COUNT(*) as count FROM posts').get() as { count: number };
  if (postCount.count === 0) {
    const insertPost = sqliteDb.prepare('INSERT INTO posts (id, user_id, title, content, views) VALUES (?, ?, ?, ?, ?)');
    insertPost.run(456, 123, "Why First-Principles Thinking Matters in Backend", "Mastering the underlying mechanics transforms architecture.", 1420);
    insertPost.run(457, 123, "Understanding Connection Pooling & Sockets", "Multiplexing client queries over limited TCP sockets.", 890);
  }

  const productCount = sqliteDb.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if (productCount.count === 0) {
    const insertProduct = sqliteDb.prepare('INSERT INTO products (name, title, price, currency, sku) VALUES (?, ?, ?, ?, ?)');
    insertProduct.run("Mechanical Keyboard", "Mechanical Keyboard", 120.00, "USD", "KB-MECH-01");
    insertProduct.run("4K IPS Monitor", "4K IPS Monitor", 450.00, "USD", "DISP-4K-02");
    insertProduct.run("Ergonomic Chair", "Ergonomic Chair", 350.00, "USD", "FURN-CHAIR-03");
  }
}

async function initPostgresSchema() {
  if (!pgPool) return;

  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS device_likes (
      device_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (device_id, target_id)
    );

    CREATE TABLE IF NOT EXISTS device_progress (
      device_id TEXT PRIMARY KEY,
      completed_slugs TEXT NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL DEFAULT 'Engineer',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      content TEXT,
      views INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      price REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      sku TEXT UNIQUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS idempotency_records (
      id SERIAL PRIMARY KEY,
      item TEXT NOT NULL,
      action TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default platform likes if empty
  const likeRes = await pgPool.query('SELECT COUNT(*) as count FROM device_likes');
  const likeCount = parseInt(likeRes.rows[0]?.count || '0', 10);
  if (likeCount === 0) {
    await pgPool.query(`
      INSERT INTO device_likes (device_id, target_id) VALUES
        ('device-seed-1', 'platform-root'),
        ('device-seed-2', 'platform-root'),
        ('device-seed-3', 'platform-root'),
        ('device-seed-1', '01-roadmap'),
        ('device-seed-2', '01-roadmap'),
        ('device-seed-1', '03-what-is-a-backend'),
        ('device-seed-3', '05-http-protocol'),
        ('device-seed-1', '06-backend-routing'),
        ('device-seed-2', '06-backend-routing')
      ON CONFLICT DO NOTHING;
    `);
  }

  // Seed Books
  const bookRes = await pgPool.query('SELECT COUNT(*) as count FROM books');
  if (parseInt(bookRes.rows[0]?.count || '0', 10) === 0) {
    await pgPool.query(`
      INSERT INTO books (title, author) VALUES
        ('Designing Data-Intensive Applications', 'Martin Kleppmann'),
        ('Computer Networking: A Top-Down Approach', 'Kurose & Ross'),
        ('Operating Systems: Three Easy Pieces', 'Arpaci-Dusseau'),
        ('Database Internals', 'Alex Petrov'),
        ('System Design Interview', 'Alex Xu');
    `);
  }

  const userRes = await pgPool.query('SELECT COUNT(*) as count FROM users');
  if (parseInt(userRes.rows[0]?.count || '0', 10) === 0) {
    await pgPool.query(`
      INSERT INTO users (id, name, email, role) VALUES
        (123, 'Sachin Manral', 'sachin@example.com', 'Backend Engineer'),
        (456, 'Alex Rivera', 'alex@example.com', 'Distributed Systems Architect')
      ON CONFLICT DO NOTHING;
    `);
  }

  const postRes = await pgPool.query('SELECT COUNT(*) as count FROM posts');
  if (parseInt(postRes.rows[0]?.count || '0', 10) === 0) {
    await pgPool.query(`
      INSERT INTO posts (id, user_id, title, content, views) VALUES
        (456, 123, 'Why First-Principles Thinking Matters in Backend', 'Mastering the underlying mechanics transforms architecture.', 1420),
        (457, 123, 'Understanding Connection Pooling & Sockets', 'Multiplexing client queries over limited TCP sockets.', 890)
      ON CONFLICT DO NOTHING;
    `);
  }

  const productRes = await pgPool.query('SELECT COUNT(*) as count FROM products');
  if (parseInt(productRes.rows[0]?.count || '0', 10) === 0) {
    await pgPool.query(`
      INSERT INTO products (name, title, price, currency, sku) VALUES
        ('Mechanical Keyboard', 'Mechanical Keyboard', 120.00, 'USD', 'KB-MECH-01'),
        ('4K IPS Monitor', '4K IPS Monitor', 450.00, 'USD', 'DISP-4K-02'),
        ('Ergonomic Chair', 'Ergonomic Chair', 350.00, 'USD', 'FURN-CHAIR-03')
      ON CONFLICT DO NOTHING;
    `);
  }

  console.log(`[POSTGRES DB] 🚀 Persistent Cloud PostgreSQL database connected & initialized.`);
}

export default sqliteDb;
