import { Router, Request, Response } from 'express';

const router = Router();

/**
 * ============================================================================
 * DEMO: Cross-Origin Resource Sharing (CORS) Mechanics
 * Endpoints:
 *   - GET /api/demo/cors/simple?allowCors=true|false
 *   - OPTIONS /api/demo/cors/preflight?allowCors=true|false
 *   - PUT /api/demo/cors/preflight?allowCors=true|false
 * ============================================================================
 * 
 * FIRST PRINCIPLE:
 * CORS is enforced by the BROWSER client engine, not the server socket.
 * When the frontend running on port 3000 calls the backend on port 4000,
 * the browser checks if the response headers allow http://localhost:3000.
 */

function handleCorsHeaders(req: Request, res: Response): boolean {
  const allowQuery = req.query.allowCors;
  const isAllowed = allowQuery !== 'false' && allowQuery !== '0';
  const clientOrigin = req.get('origin') || 'http://localhost:3000';

  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', clientOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Custom-Header, X-First-Principles-Auth');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.setHeader('Access-Control-Expose-Headers', 'ETag, X-Server-Time, X-Preflight-Handled');
  } else {
    res.removeHeader('Access-Control-Allow-Origin');
    res.removeHeader('Access-Control-Allow-Methods');
    res.removeHeader('Access-Control-Allow-Headers');
  }

  return isAllowed;
}

router.get('/cors/simple', (req: Request, res: Response) => {
  const isAllowed = handleCorsHeaders(req, res);

  res.json({
    _note: isAllowed
      ? "CORS Allowed: Server attached 'Access-Control-Allow-Origin' header matching caller origin. The browser permits frontend JS to read this response."
      : "CORS Blocked Simulation: The server deliberately omitted 'Access-Control-Allow-Origin'. In a browser cross-origin fetch, your browser would suppress this response with a CORS policy error!",
    flowType: "Simple Request (GET)",
    corsEnabledOnServer: isAllowed,
    clientOriginReceived: req.get('origin') || '(direct request / no origin header)',
    simulatedAt: new Date().toISOString(),
    tip: "Add '?allowCors=false' to query params to test the blocked flow, or '?allowCors=true' to allow."
  });
});

router.options('/cors/preflight', (req: Request, res: Response) => {
  const isAllowed = handleCorsHeaders(req, res);

  if (!isAllowed) {
    return res.status(403).json({
      _note: "Preflight Denied: Server refused OPTIONS preflight request. Real PUT/DELETE request will never be sent by the browser.",
      corsEnabled: false
    });
  }

  res.setHeader('X-Preflight-Handled', 'true');
  res.status(204).end();
});

router.put('/cors/preflight', (req: Request, res: Response) => {
  const isAllowed = handleCorsHeaders(req, res);
  const customHeader = req.get('x-first-principles-auth') || req.get('x-custom-header');

  res.json({
    _note: isAllowed
      ? "Preflight Successful! The browser first completed the OPTIONS preflight handshake and then fired this real PUT request with custom headers."
      : "CORS Blocked on PUT payload response.",
    flowType: "Preflight Request Flow (OPTIONS ➔ PUT)",
    method: "PUT",
    corsEnabledOnServer: isAllowed,
    receivedCustomHeader: customHeader || null,
    bodyReceived: req.body || null,
    serverMessage: "Resource successfully updated after CORS verification."
  });
});

export default router;
