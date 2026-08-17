import { DemoEndpoint } from './types';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const DEMO_CATALOG: DemoEndpoint[] = [
  {
    id: 'echo',
    title: '1. Request Anatomy Inspector',
    category: 'Protocol Basics',
    method: 'POST',
    path: '/api/demo/echo?source=playground&client=browser',
    description: 'Intercepts your raw HTTP byte stream and echoes back every parsed header, query param, body field, and client IP.',
    conceptNote: 'Inspects how TCP stream bytes are partitioned into headers and body separated by the double CRLF.',
    defaultHeaders: {
      'Content-Type': 'application/json',
      'X-First-Principles-Client': 'WebPlayground/1.0',
      'X-Student-Goal': 'MasteringBackendArchitecture'
    },
    defaultBody: {
      action: 'InspectRequestAnatomy',
      message: 'Hello from Frontend Browser!',
      timestamp: new Date().toISOString()
    }
  },
  {
    id: 'status',
    title: '2. Status Code Matrix',
    category: 'Status Codes',
    method: 'GET',
    path: '/api/demo/status/200',
    description: 'Returns realistic HTTP responses for standard status codes across 2xx, 3xx, 4xx, and 5xx families.',
    conceptNote: 'Examine response status line headers and learn typical behavior for each status code family.',
    customControls: [
      {
        type: 'select',
        label: 'Select Status Code',
        key: 'code',
        defaultValue: '200',
        options: [
          { label: '200 OK', value: '200' },
          { label: '201 Created', value: '201' },
          { label: '204 No Content', value: '204' },
          { label: '301 Moved', value: '301' },
          { label: '304 Not Modified', value: '304' },
          { label: '400 Bad Request', value: '400' },
          { label: '401 Unauthorized', value: '401' },
          { label: '403 Forbidden', value: '403' },
          { label: '404 Not Found', value: '404' },
          { label: '409 Conflict', value: '409' },
          { label: '500 Server Error', value: '500' },
          { label: '504 Timeout', value: '504' }
        ]
      }
    ]
  },
  {
    id: 'cors',
    title: '3. CORS Flow & Preflight Inspector',
    category: 'Security & Browsers',
    method: 'PUT',
    path: '/api/demo/cors/preflight?allowCors=true',
    description: 'Toggle Access-Control headers to simulate allowed vs blocked cross-origin requests and watch OPTIONS preflight handshakes.',
    conceptNote: 'Demonstrates why CORS errors are triggered by the browser engine rather than the backend rejecting packets.',
    defaultHeaders: {
      'Content-Type': 'application/json',
      'X-First-Principles-Auth': 'session-token-preflight-abc123'
    },
    defaultBody: {
      command: 'update_security_profile',
      origin: 'http://localhost:3000'
    },
    customControls: [
      {
        type: 'toggle',
        label: 'Server CORS Policy',
        key: 'allowCors',
        defaultValue: 'true',
        options: [
          { label: 'CORS Allowed', value: 'true' },
          { label: 'CORS Blocked', value: 'false' }
        ]
      },
      {
        type: 'select',
        label: 'Flow Type',
        key: 'flow',
        defaultValue: 'preflight',
        options: [
          { label: 'Preflight Flow (PUT)', value: 'preflight' },
          { label: 'Simple Request (GET)', value: 'simple' }
        ]
      }
    ]
  },
  {
    id: 'cache',
    title: '4. HTTP Caching & 304 Validation',
    category: 'Performance',
    method: 'GET',
    path: '/api/demo/cache/resource',
    description: 'Serves ETag and Cache-Control headers. Repeat GET with If-None-Match to witness a 304 Not Modified 0-byte transfer.',
    conceptNote: 'Understand the difference between fresh 200 payload transfers and 304 bandwidth-saving validation checks.',
    defaultHeaders: {
      'If-None-Match': 'W/"f9a8b7c6d5e4"'
    },
    customControls: [
      {
        type: 'select',
        label: 'Cache Action',
        key: 'action',
        defaultValue: 'get_conditional',
        options: [
          { label: 'Conditional 304 (with ETag)', value: 'get_conditional' },
          { label: 'Fresh 200 (No ETag)', value: 'get_fresh' },
          { label: 'Mutate (New ETag)', value: 'patch_mutate' }
        ]
      }
    ]
  },
  {
    id: 'negotiate',
    title: '5. Content Negotiation Engine',
    category: 'HTTP Standards',
    method: 'GET',
    path: '/api/demo/negotiate',
    description: 'Test how server adapts its response MIME format and language based on client Accept and Accept-Language headers.',
    conceptNote: 'Inspects how one single endpoint can render JSON, XML, or plain text depending entirely on client header negotiation.',
    defaultHeaders: {
      'Accept': 'application/json',
      'Accept-Language': 'en'
    },
    customControls: [
      {
        type: 'select',
        label: 'Accept Format',
        key: 'acceptFormat',
        defaultValue: 'application/json',
        options: [
          { label: 'JSON', value: 'application/json' },
          { label: 'XML', value: 'application/xml' },
          { label: 'Plain Text', value: 'text/plain' }
        ]
      },
      {
        type: 'select',
        label: 'Accept Language',
        key: 'acceptLang',
        defaultValue: 'en',
        options: [
          { label: 'English', value: 'en' },
          { label: 'Spanish', value: 'es' },
          { label: 'Hindi', value: 'hi' },
          { label: 'French', value: 'fr' }
        ]
      }
    ]
  },
  {
    id: 'compress',
    title: '6. Payload Compression (Gzip)',
    category: 'Performance',
    method: 'GET',
    path: '/api/demo/compress?gzip=true&count=300',
    description: 'Fetches a large 300-record dataset with gzip compression active vs disabled to measure transfer size shrink (~85% savings).',
    conceptNote: 'Examines Content-Encoding: gzip and wire transfer reduction for high-throughput backend APIs.',
    customControls: [
      {
        type: 'toggle',
        label: 'Compression',
        key: 'gzip',
        defaultValue: 'true',
        options: [
          { label: 'Gzip Enabled', value: 'true' },
          { label: 'Uncompressed', value: 'false' }
        ]
      }
    ]
  },
  {
    id: 'upload',
    title: '7. Multipart Form-Data Upload',
    category: 'Data Transfer',
    method: 'POST',
    path: '/api/demo/upload',
    description: 'Transmits binary file metadata and text fields separated by RFC multipart boundary delimiters.',
    conceptNote: 'Inspects how multipart boundaries stream binary payloads without memory-heavy base64 string bloat.',
    defaultBody: {
      description: "First Principles multipart file test from playground console",
      uploaderRole: "Student",
      fileType: "text/plain"
    }
  },
  {
    id: 'stream',
    title: '8. Chunked Streaming & SSE',
    category: 'Real-Time Protocols',
    method: 'GET',
    path: '/api/demo/stream?steps=5&interval=500',
    description: 'Opens a persistent HTTP socket connection with Transfer-Encoding: chunked and watches Server-Sent Events arrive live.',
    conceptNote: 'Watch progressive chunk delivery over a single TCP socket without needing WebSockets or polling.',
    customControls: [
      {
        type: 'select',
        label: 'Stream Steps',
        key: 'steps',
        defaultValue: '5',
        options: [
          { label: '3 Chunks', value: '3' },
          { label: '5 Chunks', value: '5' },
          { label: '8 Chunks', value: '8' }
        ]
      }
    ]
  },
  {
    id: 'idempotency',
    title: '9. Idempotency & Safe Methods',
    category: 'API Design & State',
    method: 'POST',
    path: '/api/demo/idempotent-check',
    description: 'Fires GET, POST, PUT, and DELETE to observe which methods alter state upon repetition vs which guarantee identical end state.',
    conceptNote: 'Proves mathematical idempotency: f(f(x)) = f(x). Critical for reliable distributed retry policies.',
    defaultHeaders: {
      'Content-Type': 'application/json'
    },
    defaultBody: {
      action: 'create_record',
      item: 'demo-transaction'
    },
    customControls: [
      {
        type: 'select',
        label: 'HTTP Method',
        key: 'method',
        defaultValue: 'POST',
        options: [
          { label: 'POST (Non-Idempotent)', value: 'POST' },
          { label: 'GET (Safe & Idempotent)', value: 'GET' },
          { label: 'PUT (Idempotent)', value: 'PUT' },
          { label: 'DELETE (Idempotent)', value: 'DELETE' }
        ]
      }
    ]
  },
  {
    id: 'routingStatic',
    title: '10. Static Routing (GET vs POST)',
    category: 'Routing',
    method: 'GET',
    path: '/api/demo/routing/books',
    description: 'Demonstrates static route mapping where the same fixed path serves different handlers based on the HTTP method.',
    conceptNote: 'Method + URL Path forms the composite lookup key in the server router tree.',
    defaultHeaders: {
      'Content-Type': 'application/json'
    },
    defaultBody: {
      title: "Building Microservices with Go",
      author: "Sachin Manral"
    },
    customControls: [
      {
        type: 'select',
        label: 'Action Preset',
        key: 'action',
        defaultValue: 'get_books',
        options: [
          { label: 'Fetch Books (GET)', value: 'get_books' },
          { label: 'Create Book (POST)', value: 'post_book' }
        ]
      }
    ]
  },
  {
    id: 'routingDynamic',
    title: '11. Dynamic Path Parameters (:id)',
    category: 'Routing',
    method: 'GET',
    path: '/api/demo/routing/users/123',
    description: 'Extracts dynamic entity identifiers from path slots (:id) to perform database record lookups.',
    conceptNote: 'Semantic entity addressing: URL path parameters represent specific resources.',
    customControls: [
      {
        type: 'select',
        label: 'User Preset',
        key: 'userId',
        defaultValue: '123',
        options: [
          { label: 'User 123', value: '123' },
          { label: 'User 456', value: '456' },
          { label: 'User 999 (404)', value: '999' }
        ]
      }
    ]
  },
  {
    id: 'routingQuery',
    title: '12. Query Parameters & Search',
    category: 'Routing',
    method: 'GET',
    path: '/api/demo/routing/search?query=first-principles&filter=backend',
    description: 'Transmits non-semantic filtering and search criteria using key-value pairs after the ? delimiter.',
    conceptNote: 'Used with GET requests which do not carry payload bodies.'
  },
  {
    id: 'routingPagination',
    title: '13. Pagination Data Contracts',
    category: 'Routing',
    method: 'GET',
    path: '/api/demo/routing/books-paginated?page=2&limit=2',
    description: 'Slices large datasets into pages with metadata (currentPage, limit, totalPages, totalRecords).',
    conceptNote: 'Essential for scalable APIs avoiding memory-crashing full-table scans.'
  },
  {
    id: 'routingNested',
    title: '14. Nested Entity Routes',
    category: 'Routing',
    method: 'GET',
    path: '/api/demo/routing/users/123/posts/456',
    description: 'Expresses parent-child domain hierarchies (User #123 ➔ Post #456) in clean REST paths.',
    conceptNote: 'Multi-level path parameter extraction mirroring relational foreign key relationships.'
  },
  {
    id: 'routingV1',
    title: '15. Route Versioning (v1 Legacy)',
    category: 'Routing',
    method: 'GET',
    path: '/api/demo/routing/v1/products',
    description: 'Serves legacy contract format with name field for older client applications.',
    conceptNote: 'Provides backward compatibility while modernizing backend systems.'
  },
  {
    id: 'routingV2',
    title: '16. Route Versioning (v2 Breaking Schema)',
    category: 'Routing',
    method: 'GET',
    path: '/api/demo/routing/v2/products',
    description: 'Serves modern schema with title, currency, and SKU fields without breaking v1 clients.',
    conceptNote: 'Graceful migration window for frontend teams before deprecating legacy endpoints.'
  },
  {
    id: 'serializationJsonFlow',
    title: '17. JSON Wire Serialization & Parsing',
    category: 'Serialization',
    method: 'POST',
    path: '/api/demo/serialization/json-flow',
    description: 'Sends a structured JSON payload, inspects server-side deserialization into memory, and observes re-serialized JSON response.',
    conceptNote: 'Demonstrates converting dynamic client memory objects into wire strings and reconstructing them in backend memory.',
    defaultHeaders: {
      'Content-Type': 'application/json'
    },
    defaultBody: {
      id: 101,
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      inStock: true,
      price: 45.99
    }
  },
  {
    id: 'serializationFormatCompare',
    title: '18. Format Comparison: JSON vs YAML vs XML vs Protobuf',
    category: 'Serialization',
    method: 'POST',
    path: '/api/demo/serialization/format-compare',
    description: 'Compares text-based formats (JSON, YAML, XML) with binary wire formats (Protobuf) showing byte compactness and parsing differences.',
    conceptNote: 'Understand why JSON dominates REST APIs (~80%) and when to choose binary formats like Protobuf for high-speed gRPC microservices.',
    defaultHeaders: {
      'Content-Type': 'application/json'
    },
    defaultBody: {
      id: 101,
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      inStock: true,
      price: 45.99,
      tags: ["databases", "distributed-systems", "architecture"]
    }
  },
  {
    id: 'authLogin',
    title: '19. Login & Token Issuer (JWT vs Session)',
    category: 'Authentication',
    method: 'POST',
    path: '/api/demo/auth/login',
    description: 'Simulates secure credential verification with constant-time timing protection, generic error responses, and dual issuance of stateless JWT and stateful Session ID.',
    conceptNote: 'Demonstrates why generic errors prevent username enumeration and compares stateless tokens against server-side session stores.',
    defaultHeaders: {
      'Content-Type': 'application/json'
    },
    defaultBody: {
      email: "engineer@firstprinciples.dev",
      password: "FirstPrinciples2026!"
    }
  },
  {
    id: 'authVerifyJwt',
    title: '20. Stateless JWT Signature Verification',
    category: 'Authentication',
    method: 'POST',
    path: '/api/demo/auth/verify-jwt',
    description: 'Cryptographically verifies the HMAC-SHA256 signature and decodes token claims in memory without requiring any database lookups.',
    conceptNote: 'Inspects header, claims payload, and signature integrity in pure memory.',
    defaultHeaders: {
      'Content-Type': 'application/json'
    },
    defaultBody: {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfOGY5YTJiMWMiLCJlbWFpbCI6ImVuZ2luZWVyQGZpcnN0cHJpbmNpcGxlcy5kZXYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3ODY5NzAwMDAsImV4cCI6MTc4Njk3MzYwMH0.signature"
    }
  },
  {
    id: 'authRbac',
    title: '21. Role-Based Access Control (RBAC Guard)',
    category: 'Authorization',
    method: 'POST',
    path: '/api/demo/auth/rbac-guard',
    description: 'Enforces permission boundaries across viewer, editor, and admin roles, differentiating 401 Unauthorized from 403 Forbidden.',
    conceptNote: 'Shows how server middleware evaluates identity claims against endpoint permission requirements.',
    defaultHeaders: {
      'Content-Type': 'application/json'
    },
    defaultBody: {
      role: "viewer",
      action: "delete_database"
    }
  },
  {
    id: 'validationPipeline',
    title: '22. Multi-Layer Validation Pipeline (Type, Syntactic, Semantic, Complex)',
    category: 'Validation',
    method: 'POST',
    path: '/api/demo/validation/pipeline',
    description: 'Tests incoming request payloads against Type, Syntactic (email/phone), Semantic (DOB/age range), and Complex (password match, conditional partner) rules before service execution.',
    conceptNote: 'Demonstrates how controller entry-point validation prevents database schema crashes and returns structured 400 Bad Request error arrays.',
    defaultHeaders: {
      'Content-Type': 'application/json'
    },
    defaultBody: {
      email: "engineer@firstprinciples.dev",
      phone: "+1-555-0199",
      dateOfBirth: "1995-06-12",
      age: 29,
      password: "SecretPassword123!",
      passwordConfirmation: "SecretPassword123!",
      married: true,
      partnerName: "Taylor",
      tags: ["backend", "distributed-systems", "postgres"]
    }
  },
  {
    id: 'validationTransform',
    title: '23. Transformation & Type Casting Pipeline',
    category: 'Validation',
    method: 'POST',
    path: '/api/demo/validation/transform',
    description: 'Casts raw query string parameters to typed integers, trims and lowercases email strings, and normalizes phone numbers into E.164 format before reaching the service layer.',
    conceptNote: 'Proves how transformation normalizes untyped wire payloads into strongly-typed domain representations.',
    defaultHeaders: {
      'Content-Type': 'application/json'
    },
    defaultBody: {
      page: "2",
      limit: "50",
      email: "  STUDENT.ENGINEER@FirstPrinciples.DEV  ",
      phone: "55501992026"
    }
  },
  {
    id: 'archPipeline',
    title: '24. 3-Layer Architecture & Middleware Pipeline Trace',
    category: 'Architecture',
    method: 'POST',
    path: '/api/demo/architecture/layered-pipeline',
    description: 'Traces the exact flow of an incoming HTTP request through Ingress Middleware, Request Context injection, Controller input validation, HTTP-agnostic Service orchestration, and Repository database persistence.',
    conceptNote: 'Demonstrates clean separation of concerns and how request context securely passes trusted user identity.',
    defaultHeaders: {
      'Content-Type': 'application/json',
      'X-Request-ID': 'req_firstprinciples_777'
    },
    defaultBody: {
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      simulatedRole: "admin",
      userId: "spoofed_hacker_id_should_be_ignored"
    }
  },
  {
    id: 'archContext',
    title: '25. Request Context & Anti-Spoofing Security',
    category: 'Architecture',
    method: 'POST',
    path: '/api/demo/architecture/request-context',
    description: 'Compares insecure client-supplied request body user IDs against cryptographically verified identity claims stored in per-request Context.',
    conceptNote: 'Proves why server layers must always read trusted identity from Request Context to prevent IDOR and impersonation attacks.',
    defaultHeaders: {
      'Content-Type': 'application/json'
    },
    defaultBody: {
      userId: "usr_attacker_spoof_target_victim"
    }
  },
  {
    id: 'apiDesignCrud',
    title: '26. REST CRUD with Sane Defaults, Pagination & Sorting',
    category: 'API Design',
    method: 'GET',
    path: '/api/demo/api-design/projects?page=1&limit=2&status=active&sort=name-asc',
    description: 'Demonstrates professional REST resource collections (/projects) with automatic fallback sane defaults (page=1, limit=10), status filtering, and sorting.',
    conceptNote: 'Proves how plural nouns, query parameter pagination, and sane defaults make public APIs predictable and stable.',
    defaultHeaders: {
      'Accept': 'application/json'
    }
  },
  {
    id: 'apiDesignCustomAction',
    title: '27. Non-CRUD Custom Action & PUT vs PATCH Semantics',
    category: 'API Design',
    method: 'POST',
    path: '/api/demo/api-design/projects/proj_alpha_01/clone',
    description: 'Executes a custom business action (POST /projects/:id/clone) that falls outside standard CRUD, creating a duplicated resource draft.',
    conceptNote: 'Demonstrates how to cleanly design custom non-CRUD operations using explicit action verbs on resource sub-paths.',
    defaultHeaders: {
      'Content-Type': 'application/json'
    },
    defaultBody: {
      newName: "Cloned Distributed Sockets Gateway (v2)"
    }
  }
];


export function getDemoById(id: string): DemoEndpoint | undefined {
  return DEMO_CATALOG.find(d => d.id === id);
}

export function generateCurlSnippet(demo: DemoEndpoint, overrideUrl?: string, overrideMethod?: string, overrideHeaders?: Record<string, string>, overrideBody?: any): string {
  const method = overrideMethod || demo.method;
  const url = overrideUrl || `${API_BASE_URL}${demo.path}`;
  const headers = overrideHeaders || demo.defaultHeaders || {};
  const body = overrideBody !== undefined ? overrideBody : demo.defaultBody;

  const parts = [`curl -X ${method} "${url}"`];

  Object.entries(headers).forEach(([k, v]) => {
    parts.push(`  -H "${k}: ${v}"`);
  });

  if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
    const jsonStr = JSON.stringify(body).replace(/"/g, '\\"');
    parts.push(`  -d "${jsonStr}"`);
  }

  return parts.join(' \\\n');
}
