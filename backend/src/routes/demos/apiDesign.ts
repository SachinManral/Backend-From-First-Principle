import { Router, Request, Response } from 'express';

const router = Router();

/**
 * ============================================================================
 * FIRST PRINCIPLE: REST API DESIGN & PRINCIPLES (Lecture 11)
 * 
 * 1. Uniform Interface & URL Design:
 *    - Plural resource nouns (/v1/projects) with lowercase kebab-case segments.
 *    - Strict JSON naming consistency (camelCase).
 * 
 * 2. HTTP Method Semantics & Idempotency:
 *    - GET: Idempotent & Safe (Read-only).
 *    - POST: Non-idempotent (Create new resource or trigger custom action).
 *    - PUT: Idempotent complete resource replacement.
 *    - PATCH: Idempotent partial field modification.
 *    - DELETE: Idempotent resource removal.
 * 
 * 3. Enterprise Extensions:
 *    - Standardized error bodies with machine-readable error codes & details.
 *    - X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset headers.
 *    - Content negotiation via Accept & Content-Type headers.
 * ============================================================================
 */

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived' | 'draft';
  tags: string[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

let projectsDb: Project[] = [
  {
    id: 'proj_alpha_01',
    name: 'Distributed Sockets Gateway',
    description: 'High-throughput TCP & WebSocket connection proxy multiplexer',
    status: 'active',
    tags: ['networking', 'sockets', 'tcp'],
    ownerId: 'usr_sachin_101',
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'proj_beta_02',
    name: 'SQLite WAL Cache Engine',
    description: 'Ultra low-latency on-disk relational caching engine with write-ahead logging',
    status: 'active',
    tags: ['database', 'sqlite', 'wal'],
    ownerId: 'usr_sachin_101',
    createdAt: '2026-02-10T14:30:00Z',
    updatedAt: '2026-02-10T14:30:00Z'
  },
  {
    id: 'proj_gamma_03',
    name: 'Edge Auth Token Validator',
    description: 'Zero-lookup HMAC-SHA256 JWT verifier with constant-time timing protection',
    status: 'draft',
    tags: ['security', 'jwt', 'auth'],
    ownerId: 'usr_alex_404',
    createdAt: '2026-03-01T11:15:00Z',
    updatedAt: '2026-03-01T11:15:00Z'
  }
];

// Helper to inject Rate Limiting Headers
function setRateLimitHeaders(res: Response) {
  const nowEpochSeconds = Math.floor(Date.now() / 1000);
  const resetEpochSeconds = nowEpochSeconds + 60; // 1-minute window
  res.setHeader('X-RateLimit-Limit', '100');
  res.setHeader('X-RateLimit-Remaining', '97');
  res.setHeader('X-RateLimit-Reset', resetEpochSeconds.toString());
}

// 1. GET /api/demo/api-design/projects (Sane Defaults: Pagination, Filtering & Sorting + Rate Limit Headers)
router.get('/projects', (req: Request, res: Response) => {
  setRateLimitHeaders(res);

  // Content Negotiation check
  const acceptHeader = req.headers['accept'] || 'application/json';

  // Sane Defaults
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
  const statusFilter = (req.query.status as string) || 'all';
  const sortParam = (req.query.sort as string) || 'createdAt-desc';

  let filtered = [...projectsDb];

  // Filtering
  if (statusFilter !== 'all') {
    filtered = filtered.filter(p => p.status === statusFilter);
  }

  // Sorting
  if (sortParam === 'name-asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortParam === 'name-desc') {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  } else {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Pagination Slice
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedData = filtered.slice(startIndex, startIndex + limit);

  return res.status(200).json({
    data: paginatedData,
    meta: {
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      filtersApplied: {
        status: statusFilter,
        sort: sortParam
      },
      rateLimits: {
        limit: 100,
        remaining: 97,
        resetInSeconds: 60
      },
      contentNegotiation: {
        negotiatedMime: acceptHeader.includes('application/json') ? 'application/json' : acceptHeader,
        note: "API successfully negotiated JSON representation based on client Accept header."
      }
    }
  });
});

// 2. PUT /api/demo/api-design/projects/:id (Complete Resource Replacement with Standardized Errors)
router.put('/projects/:id', (req: Request, res: Response) => {
  setRateLimitHeaders(res);
  const { id } = req.params;
  const { name, description, status, tags, ownerId } = req.body || {};

  const missingFields: string[] = [];
  if (!name) missingFields.push('name');
  if (!description) missingFields.push('description');
  if (!status) missingFields.push('status');
  if (!tags) missingFields.push('tags');
  if (!ownerId) missingFields.push('ownerId');

  // Standardized Error Response
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: {
        code: "INVALID_REQUEST_BODY",
        message: "PUT replaces the entire entity. All mandatory fields must be provided in the payload.",
        details: missingFields.map(f => ({
          field: f,
          issue: `Field '${f}' is required for complete resource replacement via PUT.`
        }))
      }
    });
  }

  const existingIdx = projectsDb.findIndex(p => p.id === id);
  const updatedProject: Project = {
    id,
    name,
    description,
    status,
    tags: Array.isArray(tags) ? tags : [tags],
    ownerId,
    createdAt: existingIdx >= 0 ? projectsDb[existingIdx].createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (existingIdx >= 0) {
    projectsDb[existingIdx] = updatedProject;
  } else {
    projectsDb.push(updatedProject);
  }

  return res.status(200).json({
    message: `Project '${id}' completely replaced via PUT`,
    semanticRule: "PUT replaces the entire resource. Any previously existing fields not provided in payload are overwritten.",
    data: updatedProject
  });
});

// 3. PATCH /api/demo/api-design/projects/:id (Partial Field Modification)
router.patch('/projects/:id', (req: Request, res: Response) => {
  setRateLimitHeaders(res);
  const { id } = req.params;
  const updates = req.body || {};

  const project = projectsDb.find(p => p.id === id);
  if (!project) {
    return res.status(404).json({
      error: {
        code: "RESOURCE_NOT_FOUND",
        message: `Project with ID '${id}' does not exist.`,
        details: [{ field: "id", issue: "No resource matches the supplied identifier." }]
      }
    });
  }

  // Selective merge (only modify fields supplied in payload)
  if (updates.name !== undefined) project.name = updates.name;
  if (updates.description !== undefined) project.description = updates.description;
  if (updates.status !== undefined) project.status = updates.status;
  if (updates.tags !== undefined) project.tags = Array.isArray(updates.tags) ? updates.tags : [updates.tags];
  project.updatedAt = new Date().toISOString();

  return res.status(200).json({
    message: `Project '${id}' partially updated via PATCH`,
    semanticRule: "PATCH selectively modifies only the provided fields while leaving omitted attributes untouched.",
    modifiedFields: Object.keys(updates),
    data: project
  });
});

// 4. POST /api/demo/api-design/projects/:id/clone (Custom Non-CRUD Action)
router.post('/projects/:id/clone', (req: Request, res: Response) => {
  setRateLimitHeaders(res);
  const { id } = req.params;
  const { newName } = req.body || {};

  const sourceProject = projectsDb.find(p => p.id === id);
  if (!sourceProject) {
    return res.status(404).json({
      error: {
        code: "SOURCE_RESOURCE_NOT_FOUND",
        message: `Cannot clone project '${id}': source project not found.`,
        details: [{ field: "id", issue: "The template project does not exist." }]
      }
    });
  }

  const clonedId = `proj_clone_${Date.now().toString(36)}`;
  const clonedProject: Project = {
    id: clonedId,
    name: newName || `${sourceProject.name} (Copy)`,
    description: sourceProject.description,
    status: 'draft',
    tags: [...sourceProject.tags, 'cloned'],
    ownerId: sourceProject.ownerId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  projectsDb.push(clonedProject);

  return res.status(201).json({
    status: 201,
    action: "CUSTOM_ACTION_CLONE_EXECUTED",
    explanation: "When an operation does not cleanly fit standard CRUD (e.g. cloning, locking, archiving, publishing), use POST /resources/:id/action-verb.",
    clonedFrom: sourceProject.id,
    createdResource: clonedProject
  });
});

export default router;
