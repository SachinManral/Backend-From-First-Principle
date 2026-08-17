import { Router, Request, Response } from 'express';

const router = Router();

/**
 * ============================================================================
 * LECTURE 6: BACKEND ROUTING FROM FIRST PRINCIPLES
 * 
 * 1. Static Routes (/books)
 * 2. Dynamic Path Parameters (/users/:id)
 * 3. Query Parameters (/search?query=..., /books?page=2&limit=5)
 * 4. Nested Routes (/users/:userId/posts/:postId)
 * 5. Route Versioning (/v1/products vs /v2/products)
 * 6. Catch-All Fallback Wildcards
 * ============================================================================
 */

// In-memory mock database for live interactive demos
let books = [
  { id: 1, title: "Designing Data-Intensive Applications", author: "Martin Kleppmann" },
  { id: 2, title: "Computer Networking: A Top-Down Approach", author: "Kurose & Ross" },
  { id: 3, title: "Operating Systems: Three Easy Pieces", author: "Arpaci-Dusseau" },
  { id: 4, title: "Database Internals", author: "Alex Petrov" },
  { id: 5, title: "System Design Interview", author: "Alex Xu" }
];

const mockUsers: Record<string, any> = {
  "123": { id: 123, name: "Sachin Manral", role: "Backend Engineer", email: "sachin@example.com" },
  "456": { id: 456, name: "Alex Rivera", role: "Distributed Systems Architect", email: "alex@example.com" }
};

const mockPosts: Record<string, any> = {
  "456": { id: 456, authorId: 123, title: "Why First-Principles Thinking Matters in Backend", views: 1420 }
};

// 1. Static Route: GET /api/demo/routing/books
router.get('/routing/books', (_req: Request, res: Response) => {
  res.json({
    _meta: {
      routeType: "Static Route",
      method: "GET",
      matchedPattern: "/api/demo/routing/books",
      explanation: "Fixed URL path with unchanging static matching."
    },
    count: books.length,
    data: books
  });
});

// 1b. Static Route: POST /api/demo/routing/books (Different Method, Same Path)
router.post('/routing/books', (req: Request, res: Response) => {
  const { title, author } = req.body || {};
  const newBook = {
    id: books.length + 1,
    title: title || `Engineering Guide #${books.length + 1}`,
    author: author || "First Principles Author"
  };
  books.push(newBook);

  res.status(201).json({
    _meta: {
      routeType: "Static Route (Creation)",
      method: "POST",
      matchedPattern: "/api/demo/routing/books",
      keyCombination: "POST + /api/demo/routing/books ➔ Unique Handler"
    },
    message: "New book record created successfully",
    created: newBook,
    totalBooks: books.length
  });
});

// 2. Dynamic Route: GET /api/demo/routing/users/:id
router.get('/routing/users/:id', (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = mockUsers[userId] || {
    id: userId,
    name: `User_${userId}`,
    role: "Software Engineer (Extracted from path param)",
    email: `user${userId}@domain.com`
  };

  res.json({
    _meta: {
      routeType: "Dynamic Route (Path Parameter)",
      matchedPattern: "/api/demo/routing/users/:id",
      extractedParams: { id: userId },
      explanation: "The colon ':id' informs the router to capture this segment as dynamic data."
    },
    user
  });
});

// 3. Query Parameters: GET /api/demo/routing/search?query=...
router.get('/routing/search', (req: Request, res: Response) => {
  const query = (req.query.query as string) || "backend-principles";
  const filter = (req.query.filter as string) || "all";

  res.json({
    _meta: {
      routeType: "Query Parameter Search",
      matchedPattern: "/api/demo/routing/search",
      extractedQueryParams: req.query,
      explanation: "Non-semantic key-value metadata passed after the '?' delimiter."
    },
    query,
    filter,
    matchedResults: [
      { id: 101, title: `Search result matching query: '${query}'`, score: 0.98 }
    ]
  });
});

// 3b. Query Parameters: GET /api/demo/routing/books-paginated?page=2&limit=2
router.get('/routing/books-paginated', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 2;
  const startIndex = (page - 1) * limit;
  const paginatedData = books.slice(startIndex, startIndex + limit);

  res.json({
    _meta: {
      routeType: "Paginated Query Route",
      currentPage: page,
      limit,
      totalRecords: books.length,
      totalPages: Math.ceil(books.length / limit)
    },
    data: paginatedData
  });
});

// 4. Nested Route: GET /api/demo/routing/users/:userId/posts/:postId
router.get('/routing/users/:userId/posts/:postId', (req: Request, res: Response) => {
  const { userId, postId } = req.params;
  const post = mockPosts[postId] || {
    id: postId,
    authorId: userId,
    title: `Dynamic Post #${postId} by User ${userId}`,
    views: 420
  };

  res.json({
    _meta: {
      routeType: "Nested Resource Route",
      matchedPattern: "/api/demo/routing/users/:userId/posts/:postId",
      extractedParams: { userId, postId },
      semanticHierarchy: "Users ➔ Specific User (:userId) ➔ Posts Collection ➔ Specific Post (:postId)"
    },
    post
  });
});

// 5. Versioning V1: GET /api/demo/routing/v1/products
router.get('/routing/v1/products', (_req: Request, res: Response) => {
  res.json({
    _meta: {
      version: "v1 (Legacy Contract)",
      route: "/api/demo/routing/v1/products",
      contract: "Uses 'name' property for backward compatibility."
    },
    data: [
      { id: 1, name: "Mechanical Keyboard", price: 120 },
      { id: 2, name: "4K IPS Monitor", price: 450 }
    ]
  });
});

// 5b. Versioning V2: GET /api/demo/routing/v2/products (Breaking schema update)
router.get('/routing/v2/products', (_req: Request, res: Response) => {
  res.json({
    _meta: {
      version: "v2 (Modern Breaking Contract)",
      route: "/api/demo/routing/v2/products",
      contract: "Replaced 'name' with 'title' and added ISO currency & SKU fields."
    },
    data: [
      { id: 1, title: "Mechanical Keyboard", price: 120, currency: "USD", sku: "KB-MECH-01" },
      { id: 2, title: "4K IPS Monitor", price: 450, currency: "USD", sku: "DISP-4K-02" }
    ]
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
