import { Router, Request, Response } from 'express';

const router = Router();

/**
 * ============================================================================
 * DEMO: HTTP Status Code Matrix
 * Endpoint: GET /api/demo/status/:code
 * ============================================================================
 * 
 * FIRST PRINCIPLE:
 * Status codes are 3-digit standardized integers returned on the first line
 * of every HTTP response: `HTTP/1.1 200 OK`.
 * 
 * Code Families:
 * - 1xx: Informational (Request received, continuing process)
 * - 2xx: Success (The action was successfully received, understood, and accepted)
 * - 3xx: Redirection (Further action must be taken in order to complete the request)
 * - 4xx: Client Error (Request contains bad syntax or cannot be fulfilled by caller)
 * - 5xx: Server Error (The server failed to fulfill an apparently valid request)
 */
const STATUS_DESCRIPTIONS: Record<number, { title: string; category: string; description: string; typicalFix: string }> = {
  200: {
    title: "OK",
    category: "2xx Success",
    description: "Standard response for successful HTTP requests. The payload holds the requested resource.",
    typicalFix: "Everything worked normally! No client action required."
  },
  201: {
    title: "Created",
    category: "2xx Success",
    description: "The request succeeded and a new resource was created as a result (typically following a POST).",
    typicalFix: "Resource created. Often accompanied by a `Location` header pointing to the new entity."
  },
  204: {
    title: "No Content",
    category: "2xx Success",
    description: "The server successfully processed the request, but is not returning any content in the response body.",
    typicalFix: "Common for DELETE actions or PUT updates where returning the entity is unnecessary."
  },
  301: {
    title: "Moved Permanently",
    category: "3xx Redirection",
    description: "The target resource has been assigned a new permanent URI. Clients and search engines should update their bookmarks.",
    typicalFix: "Look at the `Location` header in the response and redirect all future traffic there."
  },
  302: {
    title: "Found (Temporary Redirect)",
    category: "3xx Redirection",
    description: "The target resource resides temporarily under a different URI. Future requests should still use the original URI.",
    typicalFix: "Follow the `Location` header for this specific request, but keep calling the current URL."
  },
  304: {
    title: "Not Modified",
    category: "3xx Redirection (Caching)",
    description: "Tells the client that the response has not been modified since the version specified by conditional headers (ETag / If-None-Match).",
    typicalFix: "Client reuses its locally cached response without downloading redundant payload bytes."
  },
  400: {
    title: "Bad Request",
    category: "4xx Client Error",
    description: "The server cannot or will not process the request due to perceived client error (malformed JSON, invalid query param, missing schema).",
    typicalFix: "Check your request payload schema, field types, and query parameters."
  },
  401: {
    title: "Unauthorized",
    category: "4xx Client Error",
    description: "Authentication is required and has failed or has not yet been provided. You lack valid credentials.",
    typicalFix: "Provide a valid `Authorization: Bearer <token>` or session cookie."
  },
  403: {
    title: "Forbidden",
    category: "4xx Client Error",
    description: "The server understood who you are (authenticated), but refuses to authorize the specific action (insufficient permissions).",
    typicalFix: "Authenticate with a higher-privileged user or verify RBAC role permissions."
  },
  404: {
    title: "Not Found",
    category: "4xx Client Error",
    description: "The server cannot find the requested resource. The endpoint URI does not match any route or database record.",
    typicalFix: "Verify the URL spelling, route parameters, or ID existence in the database."
  },
  409: {
    title: "Conflict",
    category: "4xx Client Error",
    description: "The request could not be completed due to a conflict with current resource state (e.g. unique email already registered, edit collision).",
    typicalFix: "Resolve state collision, retry with latest version, or pick a different unique identifier."
  },
  500: {
    title: "Internal Server Error",
    category: "5xx Server Error",
    description: "A generic catch-all error message given when an unexpected condition was encountered on the server (unhandled exception / null pointer).",
    typicalFix: "Check backend application logs and error stack traces. The server crashed or threw an unhandled error."
  },
  502: {
    title: "Bad Gateway",
    category: "5xx Server Error",
    description: "The server, while acting as a gateway or proxy (e.g. Nginx), received an invalid response from the inbound upstream server (e.g. Node process down).",
    typicalFix: "Ensure the upstream application service is running and listening on the designated internal port."
  },
  503: {
    title: "Service Unavailable",
    category: "5xx Server Error",
    description: "The server is currently unable to handle the request due to temporary overload, maintenance, or downstream database connection drop.",
    typicalFix: "Implement exponential backoff retry in client; scale backend instances or check maintenance schedule."
  },
  504: {
    title: "Gateway Timeout",
    category: "5xx Server Error",
    description: "The server, while acting as a gateway or proxy, did not receive a timely response from an upstream server or database within the timeout limit.",
    typicalFix: "Optimize slow database queries, increase proxy timeout limits, or offload heavy processing to asynchronous background workers."
  }
};

router.get('/status/:code', (req: Request, res: Response) => {
  const code = parseInt(req.params.code, 10);
  const info = STATUS_DESCRIPTIONS[code];

  if (isNaN(code) || code < 100 || code > 599) {
    return res.status(400).json({
      _note: "Validation Error: Status code must be a valid 3-digit HTTP integer between 100 and 599.",
      error: "Invalid status code provided",
      supportedExamples: Object.keys(STATUS_DESCRIPTIONS).map(Number)
    });
  }

  if (code === 204) {
    return res.status(204).end();
  }

  if (code === 301 || code === 302) {
    res.setHeader('Location', '/api/demo/status/200');
  }

  const payload = {
    _note: `HTTP ${code} ${info ? info.title : 'Custom Code'}: Returned with matching HTTP wire status header.`,
    code,
    title: info?.title || "Custom Status",
    category: info?.category || `${Math.floor(code / 100)}xx Family`,
    description: info?.description || "User requested status response simulation.",
    typicalFix: info?.typicalFix || "Check HTTP RFC specifications for this code.",
    simulatedAt: new Date().toISOString()
  };

  res.status(code).json(payload);
});

export default router;
