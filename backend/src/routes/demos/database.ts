import { Router, Request, Response } from 'express';

const router = Router();

// Mock database dataset (simulating sample rows in PostgreSQL)
const SEED_USERS = [
  { id: 1, name: 'Alice Smith', email: 'alice@company.com', role: 'ADMIN', status: 'ACTIVE', created_at: '2026-01-10T08:00:00Z', updated_at: '2026-08-18T10:00:00Z' },
  { id: 2, name: 'Bob Jones', email: 'bob@developer.org', role: 'ENGINEER', status: 'ACTIVE', created_at: '2026-02-14T09:30:00Z', updated_at: '2026-08-18T10:00:00Z' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@enterprise.io', role: 'USER', status: 'PENDING', created_at: '2026-03-01T12:15:00Z', updated_at: '2026-08-18T10:00:00Z' },
  { id: 4, name: 'Diana Prince', email: 'diana@themyscira.net', role: 'MANAGER', status: 'ACTIVE', created_at: '2026-03-20T14:45:00Z', updated_at: '2026-08-18T10:00:00Z' },
  { id: 5, name: 'Evan Wright', email: 'evan@security.ai', role: 'AUDITOR', status: 'SUSPENDED', created_at: '2026-04-05T16:20:00Z', updated_at: '2026-08-18T10:00:00Z' },
  { id: 6, name: 'Fiona Gallagher', email: 'fiona@chicago.edu', role: 'USER', status: 'ACTIVE', created_at: '2026-05-12T11:00:00Z', updated_at: '2026-08-18T10:00:00Z' },
  { id: 7, name: 'George Clark', email: 'george@cloudinfra.org', role: 'DEVOPS', status: 'ACTIVE', created_at: '2026-06-01T07:10:00Z', updated_at: '2026-08-18T10:00:00Z' },
  { id: 8, name: 'Hannah Abbott', email: 'hannah@hogwarts.uk', role: 'USER', status: 'ACTIVE', created_at: '2026-06-18T13:40:00Z', updated_at: '2026-08-18T10:00:00Z' },
  { id: 9, name: 'Ian Malcolm', email: 'ian@chaostheory.com', role: 'CONSULTANT', status: 'ACTIVE', created_at: '2026-07-04T18:00:00Z', updated_at: '2026-08-18T10:00:00Z' },
  { id: 10, name: 'Julia Roberts', email: 'julia@hollywood.com', role: 'VIP', status: 'ACTIVE', created_at: '2026-08-01T20:30:00Z', updated_at: '2026-08-18T10:00:00Z' }
];

/**
 * POST /api/demo/database/index-benchmark
 * Simulates PostgreSQL B-Tree index scan vs full sequential table scan
 */
router.post('/index-benchmark', (req: Request, res: Response) => {
  const { email = 'alice@company.com', useIndex = true } = req.body;

  const datasetSize = 1000000;
  const targetUser = SEED_USERS.find(u => u.email.toLowerCase() === String(email).toLowerCase()) || {
    id: 842190,
    name: 'Synthetic Match',
    email: String(email),
    role: 'USER',
    status: 'ACTIVE'
  };

  if (useIndex) {
    // B-Tree logarithmic search O(log N)
    const executionPlan = [
      `Index Scan using idx_users_email on users  (cost=0.42..8.44 rows=1 width=128) (actual time=0.038..0.041 rows=1 loops=1)`,
      `  Index Cond: (email = '${email}'::text)`,
      `  Buffers: shared hit=3 (Root Page -> Branch Page -> Leaf Page)`,
      `Planning Time: 0.082 ms`,
      `Execution Time: 0.042 ms`
    ];

    return res.status(200).json({
      status: 'success',
      strategy: 'B-Tree Index Scan (O(log N))',
      metrics: {
        datasetTotalRows: datasetSize,
        pagesScanned: 3,
        totalPagesInTable: 10000,
        dataTransferredKb: 24,
        executionTimeMs: 0.042,
        speedupMultiplier: '~9,900x faster than Seq Scan',
        cacheHitRate: '100%'
      },
      matchedRecord: targetUser,
      explainAnalyzePlan: executionPlan.join('\n'),
      architecturalTakeaway: 'B-Tree indexes store ordered key-pointer pairs, allowing the database engine to traverse 1,000,000 records in just 3 disk page reads.'
    });
  } else {
    // Full sequential scan O(N)
    const executionPlan = [
      `Seq Scan on users  (cost=0.00..18450.00 rows=1 width=128) (actual time=415.201..418.600 rows=1 loops=1)`,
      `  Filter: (email = '${email}'::text)`,
      `  Rows Removed by Filter: ${datasetSize - 1}`,
      `  Buffers: shared hit=10000`,
      `Planning Time: 0.045 ms`,
      `Execution Time: 418.600 ms`
    ];

    return res.status(200).json({
      status: 'success',
      strategy: 'Full Table Scan / Sequential Scan (O(N))',
      metrics: {
        datasetTotalRows: datasetSize,
        pagesScanned: 10000,
        totalPagesInTable: 10000,
        dataTransferredKb: 80000, // 80 MB
        executionTimeMs: 418.6,
        speedupMultiplier: '1x (Baseline)',
        cacheHitRate: 'High buffer thrashing'
      },
      matchedRecord: targetUser,
      explainAnalyzePlan: executionPlan.join('\n'),
      architecturalTakeaway: 'Without an index, the database engine must sequentially read every 8KB disk page from SSD/memory to evaluate the WHERE predicate on all 1,000,000 rows.'
    });
  }
});

/**
 * POST /api/demo/database/sql-injection
 * Demonstrates the threat of string concatenation vs parameterized prepared statements
 */
router.post('/sql-injection', (req: Request, res: Response) => {
  const { input = "' OR '1'='1", mode = 'parameterized' } = req.body;

  if (mode === 'parameterized') {
    // Parameterized prepared query ($1)
    return res.status(200).json({
      status: 'success',
      defense: 'Parameterized Query (Prepared Statement Protocol)',
      compiledSql: 'SELECT id, username, email, role FROM users WHERE email = $1;',
      parameterValues: [`${input}`],
      rowsReturned: 0,
      data: [],
      securityAudit: {
        isVulnerable: false,
        astEvaluation: 'The SQL Abstract Syntax Tree (AST) was compiled BEFORE receiving parameters. The input is treated strictly as a string literal value.',
        injectionNeutralized: true
      },
      takeaway: 'Parameterized queries separate the query command from user data at the protocol wire level, making SQL injection impossible.'
    });
  } else {
    // Vulnerable string concatenation
    const rawInterpolatedSql = `SELECT id, username, email, role FROM users WHERE email = '${input}' AND status = 'ACTIVE';`;
    
    return res.status(200).json({
      status: 'vulnerable_execution',
      defense: 'Raw String Concatenation (VULNERABLE)',
      executedRawSql: rawInterpolatedSql,
      rowsReturned: SEED_USERS.length,
      data: SEED_USERS.slice(0, 4),
      securityAudit: {
        isVulnerable: true,
        astEvaluation: "CRITICAL: The single quote (') broke out of the SQL string delimiter, appending an arbitrary boolean condition ('1'='1') into the execution tree.",
        injectionNeutralized: false
      },
      takeaway: 'Concatenating untrusted user input directly into SQL strings allows attackers to alter query logic, bypass authentication, or exfiltrate private database records.'
    });
  }
});

/**
 * GET /api/demo/database/paginate
 * Demonstrates deterministic LIMIT and OFFSET pagination with metadata
 */
router.get('/paginate', (req: Request, res: Response) => {
  const page = Math.max(parseInt(String(req.query.page)) || 1, 1);
  const limit = Math.min(Math.max(parseInt(String(req.query.limit)) || 3, 1), 50);
  const offset = (page - 1) * limit;

  const totalCount = SEED_USERS.length;
  const paginatedData = SEED_USERS.slice(offset, offset + limit);
  const totalPages = Math.ceil(totalCount / limit);

  return res.status(200).json({
    status: 'success',
    paginationStrategy: 'OFFSET / LIMIT Pagination',
    sqlQuery: `SELECT id, name, email, role, status FROM users ORDER BY id ASC LIMIT ${limit} OFFSET ${offset};`,
    meta: {
      currentPage: page,
      perPageLimit: limit,
      offsetRecordsSkipped: offset,
      totalRecords: totalCount,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    },
    data: paginatedData,
    architecturalTakeaway: 'Always implement default pagination with hard caps to protect backend RAM and network bandwidth against unbounded query dumps.'
  });
});

export default router;
