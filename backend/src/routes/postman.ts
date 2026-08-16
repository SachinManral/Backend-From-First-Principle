import { Router, Request, Response } from 'express';

const router = Router();

router.get('/export/postman', (_req: Request, res: Response) => {
  const baseUrl = "http://localhost:4000";

  const collection = {
    info: {
      name: "Backend Engineering — First Principles Lab Collection",
      _postman_id: "backend-first-principles-v1",
      description: "Complete hands-on API collection for Sriniously's Backend First Principles course. Hit real endpoints to observe HTTP mechanics.",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: [
      {
        name: "1. Request Anatomy (Echo)",
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
            host: [baseUrl],
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
        name: "2. Status Codes (200 OK)",
        request: {
          method: "GET",
          header: [],
          url: {
            raw: `${baseUrl}/api/demo/status/200`,
            host: [baseUrl],
            path: ["api", "demo", "status", "200"]
          }
        }
      },
      {
        name: "2b. Status Codes (404 Not Found)",
        request: {
          method: "GET",
          header: [],
          url: {
            raw: `${baseUrl}/api/demo/status/404`,
            host: [baseUrl],
            path: ["api", "demo", "status", "404"]
          }
        }
      },
      {
        name: "2c. Status Codes (503 Service Unavailable)",
        request: {
          method: "GET",
          header: [],
          url: {
            raw: `${baseUrl}/api/demo/status/503`,
            host: [baseUrl],
            path: ["api", "demo", "status", "503"]
          }
        }
      },
      {
        name: "3. CORS Simple Request",
        request: {
          method: "GET",
          header: [],
          url: {
            raw: `${baseUrl}/api/demo/cors/simple?allowCors=true`,
            host: [baseUrl],
            path: ["api", "demo", "cors", "simple"],
            query: [{ key: "allowCors", value: "true" }]
          }
        }
      },
      {
        name: "3b. CORS Preflight PUT",
        request: {
          method: "PUT",
          header: [
            { key: "Content-Type", value: "application/json" },
            { key: "X-First-Principles-Auth", value: "token-demo-xyz" }
          ],
          body: {
            mode: "raw",
            raw: JSON.stringify({ action: "test-preflight-put" })
          },
          url: {
            raw: `${baseUrl}/api/demo/cors/preflight?allowCors=true`,
            host: [baseUrl],
            path: ["api", "demo", "cors", "preflight"],
            query: [{ key: "allowCors", value: "true" }]
          }
        }
      },
      {
        name: "4. HTTP Caching - Fresh GET (200)",
        request: {
          method: "GET",
          header: [],
          url: {
            raw: `${baseUrl}/api/demo/cache/resource`,
            host: [baseUrl],
            path: ["api", "demo", "cache", "resource"]
          }
        }
      },
      {
        name: "4b. HTTP Caching - Conditional GET (304 Not Modified)",
        request: {
          method: "GET",
          header: [
            { key: "If-None-Match", value: "W/\"f9a8b7c6d5e4\"" }
          ],
          url: {
            raw: `${baseUrl}/api/demo/cache/resource`,
            host: [baseUrl],
            path: ["api", "demo", "cache", "resource"]
          }
        }
      },
      {
        name: "4c. HTTP Caching - PATCH Invalidate Resource",
        request: {
          method: "PATCH",
          header: [
            { key: "Content-Type", value: "application/json" }
          ],
          body: {
            mode: "raw",
            raw: JSON.stringify({ content: "Updated resource to trigger new ETag hash calculation." })
          },
          url: {
            raw: `${baseUrl}/api/demo/cache/resource`,
            host: [baseUrl],
            path: ["api", "demo", "cache", "resource"]
          }
        }
      },
      {
        name: "5. Content Negotiation (JSON)",
        request: {
          method: "GET",
          header: [
            { key: "Accept", value: "application/json" },
            { key: "Accept-Language", value: "en" }
          ],
          url: {
            raw: `${baseUrl}/api/demo/negotiate`,
            host: [baseUrl],
            path: ["api", "demo", "negotiate"]
          }
        }
      },
      {
        name: "5b. Content Negotiation (XML / Spanish)",
        request: {
          method: "GET",
          header: [
            { key: "Accept", value: "application/xml" },
            { key: "Accept-Language", value: "es" }
          ],
          url: {
            raw: `${baseUrl}/api/demo/negotiate`,
            host: [baseUrl],
            path: ["api", "demo", "negotiate"]
          }
        }
      },
      {
        name: "6. Compression Demo (Gzip ON vs OFF)",
        request: {
          method: "GET",
          header: [
            { key: "Accept-Encoding", value: "gzip" }
          ],
          url: {
            raw: `${baseUrl}/api/demo/compress?gzip=true&count=300`,
            host: [baseUrl],
            path: ["api", "demo", "compress"],
            query: [
              { key: "gzip", value: "true" },
              { key: "count", value: "300" }
            ]
          }
        }
      },
      {
        name: "7. Multipart Upload",
        request: {
          method: "POST",
          header: [],
          body: {
            mode: "formdata",
            formdata: [
              { key: "description", value: "Uploaded from Postman", type: "text" },
              { key: "tag", value: "first-principles-lab", type: "text" }
            ]
          },
          url: {
            raw: `${baseUrl}/api/demo/upload`,
            host: [baseUrl],
            path: ["api", "demo", "upload"]
          }
        }
      },
      {
        name: "8. Chunked Streaming (SSE)",
        request: {
          method: "GET",
          header: [
            { key: "Accept", value: "text/event-stream" }
          ],
          url: {
            raw: `${baseUrl}/api/demo/stream?steps=5&interval=500`,
            host: [baseUrl],
            path: ["api", "demo", "stream"],
            query: [
              { key: "steps", value: "5" },
              { key: "interval", value: "500" }
            ]
          }
        }
      },
      {
        name: "9. Idempotency Check (GET, POST, PUT, DELETE)",
        request: {
          method: "POST",
          header: [
            { key: "Content-Type", value: "application/json" }
          ],
          body: {
            mode: "raw",
            raw: JSON.stringify({ item: "new-record-creation" })
          },
          url: {
            raw: `${baseUrl}/api/demo/idempotent-check`,
            host: [baseUrl],
            path: ["api", "demo", "idempotent-check"]
          }
        }
      }
    ]
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="backend-first-principles-postman.json"');
  res.json(collection);
});

export default router;
