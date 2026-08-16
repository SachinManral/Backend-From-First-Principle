import { Router, Request, Response } from 'express';

const router = Router();

/**
 * ============================================================================
 * DEMO: HTTP Request Anatomy & Inspector
 * Endpoint: ANY /api/demo/echo
 * ============================================================================
 * 
 * FIRST PRINCIPLE:
 * An HTTP request is essentially a stream of text characters sent over a TCP socket.
 * It follows a strict RFC standard:
 * 
 * [METHOD] [REQUEST-URI] [HTTP-VERSION]\r\n
 * Header-Name-1: value1\r\n
 * Header-Name-2: value2\r\n
 * \r\n (CRLF - empty line separating headers from body)
 * [OPTIONAL PAYLOAD BODY]
 * 
 * This endpoint intercepts ANY HTTP method (GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD),
 * captures every parsed segment, and echoes it back in structured JSON.
 */
router.all('/echo', (req: Request, res: Response) => {
  const method = req.method;
  const url = req.originalUrl;
  const protocol = req.protocol.toUpperCase();
  const httpVersion = `HTTP/${req.httpVersion}`;
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const headers = req.headers;
  const query = req.query;
  const body = req.body;

  const rawBodySize = body ? JSON.stringify(body).length : 0;
  const headerCount = Object.keys(headers).length;

  res.json({
    _note: "Request Anatomy Inspection: The server parsed your raw TCP byte stream into method, path, headers, and body segments.",
    meta: {
      timestamp: new Date().toISOString(),
      serverPort: 4000,
      protocol,
      httpVersion,
      clientIp: ip,
    },
    request: {
      method,
      url,
      path: req.path,
      query,
      headers,
      headerCount,
      body: body || null,
      bodySizeEstimateBytes: rawBodySize,
    },
    rawWireSimulation: [
      `${method} ${url} ${httpVersion}`,
      `Host: ${req.get('host') || 'localhost:4000'}`,
      ...Object.entries(headers)
        .filter(([k]) => k !== 'host')
        .map(([k, v]) => `${k}: ${v}`),
      '',
      body && Object.keys(body).length > 0 ? JSON.stringify(body) : '(empty body)'
    ].join('\n')
  });
});

export default router;
