import { Router, Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

const router = Router();

/**
 * ============================================================================
 * FIRST PRINCIPLE: 3-LAYER ARCHITECTURE, MIDDLEWARES & REQUEST CONTEXT (Lecture 10)
 * 
 * 1. Controller Layer:
 *    - Ingress point handling HTTP transport concerns (binding, validation, status mapping).
 *    - Delegates pure data to the Service Layer.
 * 
 * 2. Service Layer:
 *    - Pure business domain logic, 100% decoupled from HTTP (no req/res or status codes).
 *    - Orchestrates multiple repositories, transactions, emails, and external webhooks.
 * 
 * 3. Repository Layer:
 *    - Direct data persistence and query construction (Postgres, SQLite, Redis).
 *    - Strictly follows Single Responsibility Principle (1 method = 1 DB query).
 * 
 * 4. Middleware Pipeline:
 *    - Chains reusable interceptors using next() to eliminate code duplication.
 *    - Execution order: CORS -> Request ID -> Logging -> Rate Limit -> Auth -> Handler -> Error Handler.
 * 
 * 5. Request Context:
 *    - Scoped storage per request life cycle.
 *    - Carries trusted auth claims (userId, role) and trace IDs across function boundaries.
 * ============================================================================
 */

interface BookRecord {
  id: string;
  title: string;
  author: string;
  userId: string;
  sortOrder: number;
  createdAt: string;
}


const booksDatabase: BookRecord[] = [
  { id: 'book_01', title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', userId: 'usr_admin', sortOrder: 1, createdAt: '2026-01-10T10:00:00Z' },
  { id: 'book_02', title: 'Database Internals', author: 'Alex Petrov', userId: 'usr_sachin', sortOrder: 2, createdAt: '2026-02-15T14:30:00Z' },
  { id: 'book_03', title: 'Computer Systems: A Programmer\'s Perspective', author: 'Randal Bryant', userId: 'usr_sachin', sortOrder: 3, createdAt: '2026-03-01T09:15:00Z' }
];

// ─── REPOSITORY LAYER (Single Responsibility Database Access) ───
class BookRepository {
  async findAll(sortBy: 'name' | 'date'): Promise<BookRecord[]> {
    const records = [...booksDatabase];
    if (sortBy === 'name') {
      return records.sort((a, b) => a.title.localeCompare(b.title));
    }
    return records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findById(id: string): Promise<BookRecord | null> {
    return booksDatabase.find(b => b.id === id) || null;
  }

  async create(data: { title: string; author: string; userId: string }): Promise<BookRecord> {
    const newRecord: BookRecord = {
      id: `book_${Date.now().toString(36)}`,
      title: data.title,
      author: data.author,
      userId: data.userId,
      sortOrder: booksDatabase.length + 1,
      createdAt: new Date().toISOString()
    };
    booksDatabase.push(newRecord);
    return newRecord;
  }
}

// ─── SERVICE LAYER (Pure Domain Logic - 100% HTTP Agnostic) ───
class BookService {
  private repo: BookRepository;

  constructor() {
    this.repo = new BookRepository();
  }

  async listBooks(sortBy?: 'name' | 'date'): Promise<{ books: BookRecord[]; count: number }> {
    // Pure business rule: default sort is by date if omitted
    const effectiveSort = sortBy || 'date';
    const books = await this.repo.findAll(effectiveSort);
    return { books, count: books.length };
  }

  async addBook(
    payload: { title: string; author: string },
    context: { userId: string; role: string; requestId: string }
  ): Promise<{ book: BookRecord; auditMessage: string }> {
    // Pure business rule: Enforce role-based capability inside domain
    if (context.role !== 'admin' && context.role !== 'author') {
      throw new Error(`FORBIDDEN_DOMAIN_ACTION: Role '${context.role}' does not have permission to publish books`);
    }

    // Call Repository Layer with trusted context userId (never client-supplied body)
    const newBook = await this.repo.create({
      title: payload.title,
      author: payload.author,
      userId: context.userId
    });

    return {
      book: newBook,
      auditMessage: `Book created by authenticated user ${context.userId} (TraceID: ${context.requestId})`
    };
  }
}

const bookService = new BookService();

/**
 * 1. POST /api/demo/architecture/layered-pipeline
 * Traces the complete lifecycle across Middleware -> Context -> Controller -> Service -> Repository
 */
router.post('/layered-pipeline', async (req: Request, res: Response) => {
  const traceLog: Array<{ step: number; layer: string; action: string; metadata: any }> = [];
  let stepIndex = 1;

  // 1. MIDDLEWARE INGRESS: Request ID & Timing
  const requestId = (req.headers['x-request-id'] as string) || `req_${randomUUID().substring(0, 8)}`;
  traceLog.push({
    step: stepIndex++,
    layer: 'Middleware (Ingress)',
    action: 'Generated and attached unique Request ID to Request Context',
    metadata: { requestId }
  });

  // 2. MIDDLEWARE INGRESS: Authentication & Context Extraction
  const authHeader = req.headers['authorization'] || '';
  const simulatedRole = req.body.simulatedRole || 'admin';
  const trustedUserId = simulatedRole === 'admin' ? 'usr_admin_007' : 'usr_guest_404';

  const requestContext = {
    requestId,
    userId: trustedUserId,
    role: simulatedRole,
    clientIp: req.ip || '127.0.0.1',
    receivedAt: new Date().toISOString()
  };

  traceLog.push({
    step: stepIndex++,
    layer: 'Middleware (Auth & Context)',
    action: 'Verified token claims and injected trusted identity into Request Context',
    metadata: {
      userId: requestContext.userId,
      role: requestContext.role,
      securityNote: 'Downstream layers will trust this context instead of any user-supplied payload'
    }
  });

  // 3. CONTROLLER LAYER: Extraction, Binding & Validation
  const rawBody = req.body || {};
  traceLog.push({
    step: stepIndex++,
    layer: 'Controller (Handler Entry)',
    action: 'Extracted JSON payload and validated input schema',
    metadata: {
      title: rawBody.title,
      author: rawBody.author,
      spoofedUserIdAttempt: rawBody.userId ? `Ignored untrusted body userId '${rawBody.userId}'` : 'None'
    }
  });

  if (!rawBody.title || typeof rawBody.title !== 'string') {
    return res.status(400).json({
      status: 400,
      verdict: 'CONTROLLER_VALIDATION_ERROR',
      error: 'Field "title" is required and must be a string',
      traceLog
    });
  }

  // 4. SERVICE LAYER: Business Logic Execution
  try {
    traceLog.push({
      step: stepIndex++,
      layer: 'Service Layer (Business Domain)',
      action: 'Executed pure domain rule checks and orchestrated repository operations',
      metadata: {
        enforcingRole: requestContext.role,
        forwardingToRepository: true
      }
    });

    const result = await bookService.addBook(
      {
        title: rawBody.title,
        author: rawBody.author || 'Anonymous First Principle Engineer'
      },
      requestContext
    );

    // 5. REPOSITORY LAYER: Database Execution
    traceLog.push({
      step: stepIndex++,
      layer: 'Repository Layer (Data Persistence)',
      action: 'Constructed SQL INSERT query and committed record to database',
      metadata: {
        persistedId: result.book.id,
        persistedUserId: result.book.userId
      }
    });

    // 6. CONTROLLER LAYER: HTTP Status Code & Response Dispatch
    traceLog.push({
      step: stepIndex++,
      layer: 'Controller (Egress)',
      action: 'Mapped domain result to HTTP 201 Created and set response headers',
      metadata: {
        statusCode: 201,
        headersSet: { 'X-Request-ID': requestId }
      }
    });

    res.setHeader('X-Request-ID', requestId);
    return res.status(201).json({
      status: 201,
      verdict: 'SUCCESS_201_CREATED',
      data: result.book,
      auditMessage: result.auditMessage,
      requestContext,
      traceLog
    });
  } catch (err: any) {
    // Global Error Middleware Simulation
    traceLog.push({
      step: stepIndex++,
      layer: 'Global Error Middleware',
      action: 'Caught domain exception and formatted into standardized client response',
      metadata: { exception: err.message }
    });

    const isForbidden = err.message.includes('FORBIDDEN_DOMAIN_ACTION');
    const statusCode = isForbidden ? 403 : 500;

    return res.status(statusCode).json({
      status: statusCode,
      verdict: isForbidden ? 'FORBIDDEN_403' : 'INTERNAL_SERVER_ERROR_500',
      error: err.message,
      requestContext,
      traceLog
    });
  }
});

/**
 * 2. POST /api/demo/architecture/request-context
 * Demonstrates how Request Context prevents identity spoofing attacks
 */
router.post('/request-context', (req: Request, res: Response) => {
  const attackerProvidedUserId = req.body.userId || 'usr_victim_account';
  const authenticatedContextUserId = 'usr_authenticated_actor_99';

  return res.status(200).json({
    status: 200,
    principle: 'REQUEST_CONTEXT_SECURITY_INVARIANT',
    explanation: 'Why backends never trust client-supplied user IDs from request body payloads:',
    comparison: {
      insecurePattern: {
        source: 'req.body.userId',
        value: attackerProvidedUserId,
        vulnerability: 'Attacker can overwrite arbitrary accounts by simply modifying JSON body (IDOR / Spoofing attack).'
      },
      firstPrinciplesPattern: {
        source: 'req.context.userId (or req.user.id)',
        value: authenticatedContextUserId,
        securityGuarantee: 'Cryptographically verified by JWT/Session middleware. Client cannot forge this value.'
      }
    },
    contextObjectInspection: {
      requestId: `req_${randomUUID().substring(0, 8)}`,
      userId: authenticatedContextUserId,
      role: 'developer',
      permissions: ['read:books', 'write:books'],
      issuedAt: new Date().toISOString()
    }
  });
});

export default router;
