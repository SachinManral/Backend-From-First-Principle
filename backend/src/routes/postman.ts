import { Router, Request, Response } from 'express';

const router = Router();

router.get('/export/postman', (_req: Request, res: Response) => {
  const baseUrl = "http://localhost:4000";

  const collection = {
    info: {
      name: "Backend Engineering — First Principles Lab Collection",
      _postman_id: "backend-first-principles-v2",
      description: "Complete hands-on API collection for Sriniously's Backend First Principles course. Formatted and structured into logical phase folders with pre-configured headers, query parameters, and realistic request payloads.",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: [
      {
        name: "📁 Phase 1: Ingress & Wire Protocols",
        description: "Fundamental TCP byte stream handling, status codes, CORS preflight, content negotiation, compression, chunked streams, and file uploads.",
        item: [
          {
            name: "01. Request Anatomy (Echo TCP Stream)",
            request: {
              method: "POST",
              header: [
                { key: "Content-Type", value: "application/json" },
                { key: "X-Custom-Client-Header", value: "FirstPrinciplesLearner/1.0" }
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify({ message: "Inspecting raw HTTP byte stream", course: "Backend First Principles" }, null, 2)
              },
              url: {
                raw: `${baseUrl}/api/demo/echo?lang=typescript&phase=1`,
                protocol: "http",
                host: ["localhost"],
                port: "4000",
                path: ["api", "demo", "echo"],
                query: [
                  { key: "lang", value: "typescript" },
                  { key: "phase", value: "1" }
                ]
              },
              description: "Interprets and echoes back every parsed element of the incoming TCP HTTP stream."
            }
          },
          {
            name: "02a. Status Codes — 200 OK",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: `${baseUrl}/api/demo/status/200`,
                protocol: "http",
                host: ["localhost"],
                port: "4000",
                path: ["api", "demo", "status", "200"]
              },
              description: "Standard successful response for HTTP GET requests."
            }
          },
          {
            name: "02b. Status Codes — 404 Not Found",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: `${baseUrl}/api/demo/status/404`,
                protocol: "http",
                host: ["localhost"],
                port: "4000",
                path: ["api", "demo", "status", "404"]
              },
              description: "Client error indicating the requested resource does not exist on the server."
            }
          },
          {
            name: "02c. Status Codes — 503 Service Unavailable",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: `${baseUrl}/api/demo/status/503`,
                protocol: "http",
                host: ["localhost"],
                port: "4000",
                path: ["api", "demo", "status", "503"]
              },
              description: "Server error indicating downstream temporary overload or maintenance."
            }
          },
          {
            name: "03a. CORS — Simple Request",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: `${baseUrl}/api/demo/cors/simple?allowCors=true`,
                protocol: "http",
                host: ["localhost"],
                port: "4000",
                path: ["api", "demo", "cors", "simple"],
                query: [{ key: "allowCors", value: "true" }]
              },
              description: "Demonstrates Same-Origin Policy (SOP) bypass via Access-Control-Allow-Origin response header."
            }
          },
          {
            name: "03b. CORS — Preflight OPTIONS / PUT",
            request: {
              method: "PUT",
              header: [
                { key: "Content-Type", value: "application/json" },
                { key: "X-First-Principles-Auth", value: "token-demo-xyz" }
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify({ action: "test-preflight-put", timestamp: new Date().toISOString() }, null, 2)
              },
              url: {
                raw: `${baseUrl}/api/demo/cors/preflight?allowCors=true`,
                protocol: "http",
                host: ["localhost"],
                port: "4000",
                path: ["api", "demo", "cors", "preflight"],
                query: [{ key: "allowCors", value: "true" }]
              },
              description: "Triggers a browser HTTP OPTIONS preflight handshake prior to executing non-simple PUT request."
            }
          },
          {
            name: "04a. Caching — Fresh Resource (ETag Generation)",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: `${baseUrl}/api/demo/cache/resource`,
                protocol: "http",
                host: ["localhost"],
                port: "4000",
                path: ["api", "demo", "cache", "resource"]
              },
              description: "Returns full JSON entity alongside strong ETag and Cache-Control headers."
            }
          },
          {
            name: "04b. Caching — Conditional GET (304 Not Modified)",
            request: {
              method: "GET",
              header: [
                { key: "If-None-Match", value: "W/\"f9a8b7c6d5e4\"" }
              ],
              url: {
                raw: `${baseUrl}/api/demo/cache/resource`,
                protocol: "http",
                host: ["localhost"],
                port: "4000",
                path: ["api", "demo", "cache", "resource"]
              },
              description: "Demonstrates 304 Not Modified with zero body transfer, saving client bandwidth."
            }
          },
          {
            name: "05. Content Negotiation (Accept Headers)",
            request: {
              method: "GET",
              header: [
                { key: "Accept", value: "application/json" },
                { key: "Accept-Language", value: "en" }
              ],
              url: {
                raw: `${baseUrl}/api/demo/negotiate/document`,
                protocol: "http",
                host: ["localhost"],
                port: "4000",
                path: ["api", "demo", "negotiate", "document"]
              },
              description: "Inspects client Accept and Accept-Language headers to return tailored MIME formats (JSON, XML, HTML, Plaintext)."
            }
          },
          {
            name: "06. HTTP Compression (Gzip / Deflate)",
            request: {
              method: "GET",
              header: [
                { key: "Accept-Encoding", value: "gzip, deflate, br" }
              ],
              url: {
                raw: `${baseUrl}/api/demo/compress?gzip=true&count=300`,
                protocol: "http",
                host: ["localhost"],
                port: "4000",
                path: ["api", "demo", "compress"],
                query: [
                  { key: "gzip", value: "true" },
                  { key: "count", value: "300" }
                ]
              },
              description: "Demonstrates 75-85% bandwidth reduction using gzip Content-Encoding for large JSON payloads."
            }
          },
          {
            name: "07. File Upload (Multipart MIME)",
            request: {
              method: "POST",
              header: [
                { key: "Content-Type", value: "application/json" }
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  fileName: "system-architecture-diagram.png",
                  fileSizeBytes: 2048576,
                  mimeType: "image/png",
                  description: "Simulated multipart upload demonstrating chunked file staging."
                }, null, 2)
              },
              url: {
                raw: `${baseUrl}/api/demo/upload/file`,
                protocol: "http",
                host: ["localhost"],
                port: "4000",
                path: ["api", "demo", "upload", "file"]
              },
              description: "Validates multipart chunk streaming and temporary disk persistence."
            }
          },
          {
            name: "08. Chunked Transfer & SSE Streaming",
            request: {
              method: "GET",
              header: [
                { key: "Accept", value: "text/event-stream" }
              ],
              url: {
                raw: `${baseUrl}/api/demo/stream?steps=5&interval=500`,
                protocol: "http",
                host: ["localhost"],
                port: "4000",
                path: ["api", "demo", "stream"],
                query: [
                  { key: "steps", value: "5" },
                  { key: "interval", value: "500" }
                ]
              },
              description: "Streams live real-time Server-Sent Events (SSE) using HTTP Chunked Transfer Encoding."
            }
          }
        ]
      },
      {
        name: "📁 Phase 2: HTTP & Data Wire Protocols",
        description: "Idempotency keys, Radix routing, Serialization (JSON vs Protobuf vs CBOR), AuthN/AuthZ (JWT vs Sessions vs RBAC), and Multi-Layer Validation.",
        item: [
          {
            name: "09. Idempotency & Safe Retries",
            request: {
              method: "POST",
              header: [
                { key: "Content-Type", value: "application/json" },
                { key: "Idempotency-Key", value: "idem_key_payment_998877" }
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  account: "acc_482910",
                  amount: 250.00,
                  currency: "USD",
                  chargeDescription: "Cloud Server Subscription Renewal"
                }, null, 2)
              },
              url: {
                raw: `${baseUrl}/api/demo/idempotency/charge`,
                protocol: "http",
                host: ["localhost"],
                port: "4000",
                path: ["api", "demo", "idempotency", "charge"]
              },
              description: "Protects payment gateways from duplicate charges using WAL-persisted idempotency locks."
            }
          },
          {
            name: "10a. URL Routing — Static Route",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: `${baseUrl}/api/demo/routing/books`,
                protocol: "http",
                host: ["localhost"],
                port: "4000",
                path: ["api", "demo", "routing", "books"]
              },
              description: "Exact prefix match routed to books controller handler."
            }
          },
          {
            name: "10b. URL Routing — Dynamic Parameter (:userId)",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: `${baseUrl}/api/demo/routing/users/usr_8f9a2b1c`,
                protocol: "http",
                host: ["localhost"],
                port: "4000",
                path: ["api", "demo", "routing", "users", "usr_8f9a2b1c"]
              },
              description: "Parametric route segment extracted by Radix Tree router."
            }
          },
          {
            name: "11. Serialization Benchmark (JSON vs Protobuf vs CBOR)",
            request: {
              method: "POST",
              header: [
                { key: "Content-Type", value: "application/json" }
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  entityCount: 100,
                  payloadComplexity: "medium"
                }, null, 2)
              },
              url: {
                raw: `${baseUrl}/api/demo/serialization/benchmark`,
                protocol: "http",
                host: ["localhost"],
                port: "4000",
                path: ["api", "demo", "serialization", "benchmark"]
              },
              description: "Compares wire byte sizes and CPU encoding latencies across JSON, Protocol Buffers, and CBOR."
            }
          },
          {
            name: "12. Auth Login (JWT & Session Token Issuer)",
            request: {
              method: "POST",
              header: [
                { key: "Content-Type", value: "application/json" }
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  email: "engineer@firstprinciples.dev",
                  password: "FirstPrinciples2026!"
                }, null, 2)
              },
              url: {
                raw: `${baseUrl}/api/demo/auth/login`,
                protocol: "http",
                host: ["localhost"],
                port: "4000",
                path: ["api", "demo", "auth", "login"]
              },
              description: "Issues both a stateless JWT and a stateful Session ID with constant-time timing protection."
            }
          },
          {
            name: "13. Stateless JWT Signature Verification",
            request: {
              method: "POST",
              header: [
                { key: "Content-Type", value: "application/json" }
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfOGY5YTJiMWMiLCJlbWFpbCI6ImVuZ2luZWVyQGZpcnN0cHJpbmNpcGxlcy5kZXYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3ODY5NzAwMDAsImV4cCI6MTc4Njk3MzYwMH0.signature"
                }, null, 2)
              },
              url: {
                raw: `${baseUrl}/api/demo/auth/verify-jwt`,
                protocol: "http",
                host: ["localhost"],
                port: "4000",
                path: ["api", "demo", "auth", "verify-jwt"]
              },
              description: "Verifies HMAC-SHA256 signature and decodes claims in pure memory without database lookups."
            }
          },
          {
            name: "14. Role-Based Access Control (RBAC Guard)",
            request: {
              method: "POST",
              header: [
                { key: "Content-Type", value: "application/json" }
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  role: "viewer",
                  action: "delete_database"
                }, null, 2)
              },
              url: {
                raw: `${baseUrl}/api/demo/auth/rbac-guard`,
                protocol: "http",
                host: ["localhost"],
                port: "4000",
                path: ["api", "demo", "auth", "rbac-guard"]
              },
              description: "Enforces 401 Unauthorized vs 403 Forbidden permission boundaries across roles."
            }
          },
          {
            name: "15. Multi-Layer Validation Pipeline (Type, Syntactic, Semantic, Complex)",
            request: {
              method: "POST",
              header: [
                { key: "Content-Type", value: "application/json" }
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  email: "engineer@firstprinciples.dev",
                  phone: "+1-555-0199",
                  dateOfBirth: "1995-06-12",
                  age: 29,
                  password: "SecretPassword123!",
                  passwordConfirmation: "SecretPassword123!",
                  married: true,
                  partnerName: "Taylor",
                  tags: ["backend", "distributed-systems", "postgres"]
                }, null, 2)
              },
              url: {
                raw: `${baseUrl}/api/demo/validation/pipeline`,
                protocol: "http",
                host: ["localhost"],
                port: "4000",
                path: ["api", "demo", "validation", "pipeline"]
              },
              description: "Intercepts invalid payloads at controller entry point, protecting database schemas with structured 400 errors."
            }
          },
          {
            name: "16. Transformation & Type Casting Pipeline",
            request: {
              method: "POST",
              header: [
                { key: "Content-Type", value: "application/json" }
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  page: "2",
                  limit: "50",
                  email: "  STUDENT.ENGINEER@FirstPrinciples.DEV  ",
                  phone: "55501992026"
                }, null, 2)
              },
              url: {
                raw: `${baseUrl}/api/demo/validation/transform`,
                protocol: "http",
                host: ["localhost"],
                port: "4000",
                path: ["api", "demo", "validation", "transform"]
              },
              description: "Casts query strings to numbers, lowercases emails, and normalizes phone numbers into E.164 format."
            }
          }
        ]
      },
      {
        name: "📁 Phase 3: Architecture & Layering",
        description: "Controllers, Services, Repositories, Middleware Interceptors, and Scoped Request Context.",
        item: [
          {
            name: "17. 3-Layer Architecture & Middleware Pipeline Trace",
            request: {
              method: "POST",
              header: [
                { key: "Content-Type", value: "application/json" },
                { key: "X-Request-ID", value: "req_firstprinciples_777" }
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  title: "Designing Data-Intensive Applications",
                  author: "Martin Kleppmann",
                  simulatedRole: "admin",
                  userId: "spoofed_hacker_id_should_be_ignored"
                }, null, 2)
              },
              url: {
                raw: `${baseUrl}/api/demo/architecture/layered-pipeline`,
                protocol: "http",
                host: ["localhost"],
                port: "4000",
                path: ["api", "demo", "architecture", "layered-pipeline"]
              },
              description: "Traces the live 6-step lifecycle through Ingress Middleware -> Context Injection -> Controller Validation -> Service Orchestration -> Repository Persistence -> HTTP 201 Created."
            }
          },
          {
            name: "18. Request Context & Anti-Spoofing Security",
            request: {
              method: "POST",
              header: [
                { key: "Content-Type", value: "application/json" }
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  userId: "usr_attacker_spoof_target_victim"
                }, null, 2)
              },
              url: {
                raw: `${baseUrl}/api/demo/architecture/request-context`,
                protocol: "http",
                host: ["localhost"],
                port: "4000",
                path: ["api", "demo", "architecture", "request-context"]
              },
              description: "Proves why server layers must always read trusted identity claims from Request Context instead of user-supplied request bodies to prevent IDOR and impersonation attacks."
            }
          },
          {
            name: "19. REST CRUD (Sane Defaults: Pagination & Sorting)",
            request: {
              method: "GET",
              header: [
                { key: "Accept", value: "application/json" }
              ],
              url: {
                raw: `${baseUrl}/api/demo/api-design/projects?page=1&limit=2&status=active&sort=name-asc`,
                protocol: "http",
                host: ["localhost"],
                port: "4000",
                path: ["api", "demo", "api-design", "projects"],
                query: [
                  { key: "page", value: "1" },
                  { key: "limit", value: "2" },
                  { key: "status", value: "active" },
                  { key: "sort", value: "name-asc" }
                ]
              },
              description: "Demonstrates plural resource nouns (/projects), pagination sane defaults (page=1, limit=10), status filtering, and sorting."
            }
          },
          {
            name: "20. PUT vs PATCH (Complete vs Partial Modification)",
            request: {
              method: "PATCH",
              header: [
                { key: "Content-Type", value: "application/json" }
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  description: "Updated description via partial PATCH update (leaving all other fields intact)"
                }, null, 2)
              },
              url: {
                raw: `${baseUrl}/api/demo/api-design/projects/proj_alpha_01`,
                protocol: "http",
                host: ["localhost"],
                port: "4000",
                path: ["api", "demo", "api-design", "projects", "proj_alpha_01"]
              },
              description: "Demonstrates PATCH selective modification versus PUT complete entity replacement."
            }
          },
          {
            name: "21. Non-CRUD Custom Action (POST /projects/:id/clone)",
            request: {
              method: "POST",
              header: [
                { key: "Content-Type", value: "application/json" }
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  newName: "Cloned Distributed Sockets Gateway (v2)"
                }, null, 2)
              },
              url: {
                raw: `${baseUrl}/api/demo/api-design/projects/proj_alpha_01/clone`,
                protocol: "http",
                host: ["localhost"],
                port: "4000",
                path: ["api", "demo", "api-design", "projects", "proj_alpha_01", "clone"]
              },
              description: "Executes a custom business action that falls outside standard CRUD, creating a duplicated resource draft."
            }
          }
        ]
      }
    ]
  };

  // Send human-readable, 2-space indented JSON with clean download headers
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="backend-first-principles-postman.json"');
  res.send(JSON.stringify(collection, null, 2));
});

export default router;
