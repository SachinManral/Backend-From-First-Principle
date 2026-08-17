import { Router, Request, Response } from 'express';
import db from '../../db/index.js';

const router = Router();

/**
 * ============================================================================
 * LECTURE 6: BACKEND ROUTING & RELATIONAL SQL DATABASE QUERIES
 * 
 * 1. Static Routes (SELECT * FROM books, INSERT INTO books)
 * 2. Dynamic Path Parameters (SELECT * FROM users WHERE id = ?)
 * 3. Query Parameters & SQL Pagination (SELECT * FROM books LIMIT ? OFFSET ?)
 * 4. Nested Routes (SELECT * FROM posts WHERE id = ? AND user_id = ?)
 * 5. Route Versioning (v1 vs v2 SQL schema queries)
 * 6. Catch-All Fallback Wildcards
 * ============================================================================
 */

// 1. Static Route: GET /api/demo/routing/books
router.get('/routing/books', (_req: Request, res: Response) => {
  const books = db.prepare('SELECT * FROM books ORDER BY id ASC').all();

  res.json({
    _meta: {
      routeType: "Static Route (SQL SELECT)",
      method: "GET",
      matchedPattern: "/api/demo/routing/books",
      database: "SQLite Disk Persistent (WAL Mode)",
      sqlExecuted: "SELECT * FROM books ORDER BY id ASC"
    },
    count: books.length,
    data: books
  });
});

// 1b. Static Route: POST /api/demo/routing/books (Different Method, Same Path)
router.post('/routing/books', (req: Request, res: Response) => {
  const { title, author } = req.body || {};
  const bookTitle = title || `Engineering Guide #${Date.now().toString().slice(-4)}`;
  const bookAuthor = author || "First Principles Author";

  const stmt = db.prepare('INSERT INTO books (title, author) VALUES (?, ?)');
  const result = stmt.run(bookTitle, bookAuthor);

  const newBook = db.prepare('SELECT * FROM books WHERE id = ?').get(result.lastInsertRowid);
  const totalCount = (db.prepare('SELECT COUNT(*) as count FROM books').get() as { count: number }).count;

  res.status(201).json({
    _meta: {
      routeType: "Static Route (SQL INSERT)",
      method: "POST",
      matchedPattern: "/api/demo/routing/books",
      sqlExecuted: "INSERT INTO books (title, author) VALUES (?, ?)",
      persistedRowId: result.lastInsertRowid
    },
    message: "New book record persisted to SQLite disk database successfully",
    created: newBook,
    totalBooks: totalCount
  });
});

// 2. Dynamic Route: GET /api/demo/routing/users/:id
router.get('/routing/users/:id', (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

  if (!user) {
    return res.status(404).json({
      _meta: {
        routeType: "Dynamic Route (404 Not Found)",
        matchedPattern: "/api/demo/routing/users/:id",
        extractedParam: userId,
        sqlExecuted: `SELECT * FROM users WHERE id = ${userId}`
      },
      error: `User #${userId} not found in database.`
    });
  }

  res.json({
    _meta: {
      routeType: "Dynamic Route (SQL Parameterized SELECT)",
      matchedPattern: "/api/demo/routing/users/:id",
      extractedParams: { id: userId },
      sqlExecuted: "SELECT * FROM users WHERE id = ?"
    },
    user
  });
});

// 3. Query Parameters: GET /api/demo/routing/search?query=...
router.get('/routing/search', (req: Request, res: Response) => {
  const query = (req.query.query as string) || "";
  const filter = (req.query.filter as string) || "all";

  const matchedBooks = db.prepare('SELECT * FROM books WHERE title LIKE ? OR author LIKE ?')
    .all(`%${query}%`, `%${query}%`);

  res.json({
    _meta: {
      routeType: "Query Parameter SQL Search",
      matchedPattern: "/api/demo/routing/search",
      extractedQueryParams: req.query,
      sqlExecuted: "SELECT * FROM books WHERE title LIKE ? OR author LIKE ?"
    },
    query,
    filter,
    totalMatched: matchedBooks.length,
    results: matchedBooks
  });
});

// 3b. Query Parameters: GET /api/demo/routing/books-paginated?page=2&limit=2
router.get('/routing/books-paginated', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 2;
  const offset = (page - 1) * limit;

  const totalRecords = (db.prepare('SELECT COUNT(*) as count FROM books').get() as { count: number }).count;
  const paginatedData = db.prepare('SELECT * FROM books ORDER BY id ASC LIMIT ? OFFSET ?').all(limit, offset);

  res.json({
    _meta: {
      routeType: "Paginated SQL Query Route",
      currentPage: page,
      limit,
      offset,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      sqlExecuted: "SELECT * FROM books ORDER BY id ASC LIMIT ? OFFSET ?"
    },
    data: paginatedData
  });
});

// 4. Nested Route: GET /api/demo/routing/users/:userId/posts/:postId
router.get('/routing/users/:userId/posts/:postId', (req: Request, res: Response) => {
  const { userId, postId } = req.params;
  const post = db.prepare(`
    SELECT posts.*, users.name as author_name, users.email as author_email
    FROM posts
    INNER JOIN users ON posts.user_id = users.id
    WHERE posts.id = ? AND posts.user_id = ?
  `).get(postId, userId);

  if (!post) {
    return res.status(404).json({
      _meta: {
        routeType: "Nested Resource (404 Not Found)",
        matchedPattern: "/api/demo/routing/users/:userId/posts/:postId",
        extractedParams: { userId, postId }
      },
      error: `Post #${postId} belonging to User #${userId} not found in database.`
    });
  }

  res.json({
    _meta: {
      routeType: "Nested Relational SQL JOIN Route",
      matchedPattern: "/api/demo/routing/users/:userId/posts/:postId",
      extractedParams: { userId, postId },
      sqlExecuted: "SELECT * FROM posts INNER JOIN users ON posts.user_id = users.id WHERE posts.id = ? AND posts.user_id = ?",
      semanticHierarchy: "Users ➔ Specific User (:userId) ➔ Posts ➔ Specific Post (:postId)"
    },
    post
  });
});

// 5. Versioning V1: GET /api/demo/routing/v1/products
router.get('/routing/v1/products', (_req: Request, res: Response) => {
  const products = db.prepare('SELECT id, name, price FROM products ORDER BY id ASC').all();

  res.json({
    _meta: {
      version: "v1 (Legacy SQL Schema Contract)",
      route: "/api/demo/routing/v1/products",
      sqlExecuted: "SELECT id, name, price FROM products ORDER BY id ASC"
    },
    data: products
  });
});

// 5b. Versioning V2: GET /api/demo/routing/v2/products (Breaking schema update)
router.get('/routing/v2/products', (_req: Request, res: Response) => {
  const products = db.prepare('SELECT id, title, price, currency, sku FROM products ORDER BY id ASC').all();

  res.json({
    _meta: {
      version: "v2 (Modern Breaking SQL Schema Contract)",
      route: "/api/demo/routing/v2/products",
      sqlExecuted: "SELECT id, title, price, currency, sku FROM products ORDER BY id ASC"
    },
    data: products
  });
});

// 6. Catch-all demo route: GET /api/demo/routing/catch-all/*
router.all('/routing/v3/products', (req: Request, res: Response) => {
  res.status(404).json({
    _meta: {
      routeType: "Catch-All Wildcard Fallback",
      matchedPattern: "/api/demo/routing/*",
      requestedPath: req.originalUrl
    },
    error: "Route Not Found",
    message: `The server does not support version 'v3' yet. Supported versions are /v1/products and /v2/products.`
  });
});

export default router;
