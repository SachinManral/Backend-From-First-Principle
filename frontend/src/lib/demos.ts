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
    description: 'Returns realistic HTTP responses for any standard status code (200, 201, 204, 301, 302, 304, 400, 401, 403, 404, 409, 500, 503, 504).',
    conceptNote: 'Examine response status line headers and learn typical fixes for 2xx, 3xx, 4xx, and 5xx families.',
    customControls: [
      {
        type: 'select',
        label: 'Select Status Code',
        key: 'code',
        defaultValue: '200',
        options: [
          { label: '200 OK (Success)', value: '200' },
          { label: '201 Created (New Resource)', value: '201' },
          { label: '204 No Content (Empty Body)', value: '204' },
          { label: '301 Moved Permanently', value: '301' },
          { label: '302 Found (Temp Redirect)', value: '302' },
          { label: '304 Not Modified (Cache Match)', value: '304' },
          { label: '400 Bad Request (Invalid Schema)', value: '400' },
          { label: '401 Unauthorized (Missing Auth)', value: '401' },
          { label: '403 Forbidden (Denied Perms)', value: '403' },
          { label: '404 Not Found (Missing URI)', value: '404' },
          { label: '409 Conflict (Duplicate State)', value: '409' },
          { label: '500 Internal Server Error (Crash)', value: '500' },
          { label: '502 Bad Gateway (Upstream Down)', value: '502' },
          { label: '503 Service Unavailable (Overload)', value: '503' },
          { label: '504 Gateway Timeout (Slow DB)', value: '504' }
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
        label: 'Enable CORS on Server (Access-Control-Allow-Origin)',
        key: 'allowCors',
        defaultValue: 'true',
        options: [
          { label: 'Allowed (true)', value: 'true' },
          { label: 'Blocked Simulation (false)', value: 'false' }
        ]
      },
      {
        type: 'select',
        label: 'Request Flow Type',
        key: 'flow',
        defaultValue: 'preflight',
        options: [
          { label: 'Preflight Flow (PUT with custom headers)', value: 'preflight' },
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
    description: 'Serves ETag and Cache-Control headers. Repeat GET with If-None-Match to witness a 304 Not Modified 0-byte transfer!',
    conceptNote: 'Understand the difference between fresh 200 payload transfers and 304 bandwidth-saving validation checks.',
    defaultHeaders: {
      'If-None-Match': 'W/"f9a8b7c6d5e4"'
    },
    customControls: [
      {
        type: 'select',
        label: 'Action',
        key: 'action',
        defaultValue: 'get_conditional',
        options: [
          { label: 'GET (Conditional with If-None-Match)', value: 'get_conditional' },
          { label: 'GET (Fresh / No ETag header)', value: 'get_fresh' },
          { label: 'PATCH (Mutate resource & generate new ETag)', value: 'patch_mutate' }
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
          { label: 'JSON (application/json)', value: 'application/json' },
          { label: 'XML (application/xml)', value: 'application/xml' },
          { label: 'Plain Text (text/plain)', value: 'text/plain' }
        ]
      },
      {
        type: 'select',
        label: 'Accept Language',
        key: 'acceptLang',
        defaultValue: 'en',
        options: [
          { label: 'English (en)', value: 'en' },
          { label: 'Spanish (es)', value: 'es' },
          { label: 'Hindi (hi)', value: 'hi' },
          { label: 'French (fr)', value: 'fr' }
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
        label: 'Gzip Compression',
        key: 'gzip',
        defaultValue: 'true',
        options: [
          { label: 'Gzip Enabled (Content-Encoding: gzip)', value: 'true' },
          { label: 'Uncompressed (Raw JSON bytes)', value: 'false' }
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
        label: 'Number of Stream Steps',
        key: 'steps',
        defaultValue: '5',
        options: [
          { label: '3 Steps (Fast)', value: '3' },
          { label: '5 Steps (Standard)', value: '5' },
          { label: '8 Steps (Detailed)', value: '8' }
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
          { label: 'POST (Non-idempotent: Creates 1 new record every click)', value: 'POST' },
          { label: 'GET (Idempotent & Safe: Read-only)', value: 'GET' },
          { label: 'PUT (Idempotent: Replaces target value)', value: 'PUT' },
          { label: 'DELETE (Idempotent: Deletes target resource)', value: 'DELETE' }
        ]
      }
    ]
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
