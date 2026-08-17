import { Router, Request, Response } from 'express';
import crypto from 'crypto';

const router = Router();

/**
 * ============================================================================
 * FIRST PRINCIPLE: AUTHENTICATION & AUTHORIZATION (Lecture 8)
 * 
 * 1. Authentication (AuthN - "Who are you?"):
 *    Verifying the identity of a client or user.
 * 
 * 2. Authorization (AuthZ - "What are you allowed to do?"):
 *    Verifying permissions and roles for a verified identity.
 * 
 * 3. Security Hardening:
 *    - Generic error messages to prevent username enumeration.
 *    - Equalized latency to mitigate cryptographic timing attacks.
 *    - Stateless JWT vs. Stateful Session comparison.
 * ============================================================================
 */

// In-memory session store simulation
const sessionStore = new Map<string, { userId: string; role: string; email: string; createdAt: number }>();

// Simple HMAC-SHA256 JWT simulator (pure Node.js crypto, zero dependencies)
const JWT_SECRET = 'backend-first-principles-super-secret-key-2026';

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function createJwt(payload: Record<string, any>): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyJwt(token: string): { valid: boolean; payload?: any; reason?: string } {
  const parts = token.split('.');
  if (parts.length !== 3) return { valid: false, reason: 'Malformed token structure (must have 3 parts separated by dots)' };
  
  const [encodedHeader, encodedPayload, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  // Constant-time signature comparison to prevent timing attacks
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return { valid: false, reason: 'Cryptographic signature mismatch! Token has been tampered with.' };
  }

  try {
    const payloadJson = Buffer.from(encodedPayload, 'base64').toString('utf8');
    const payload = JSON.parse(payloadJson);
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return { valid: false, reason: 'Token has expired.' };
    }
    return { valid: true, payload };
  } catch {
    return { valid: false, reason: 'Invalid JSON payload.' };
  }
}

// 1. Interactive Login Flow: Generic Errors & Timing Protection
router.post('/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  const startTime = performance.now();

  // Simulated valid credentials
  const VALID_USER = {
    email: 'engineer@firstprinciples.dev',
    passwordHash: 'argon2$simulated$secure_password_hash',
    userId: 'usr_8f9a2b1c',
    role: 'admin'
  };

  // Artificial constant-time latency floor to prevent timing attacks
  const sleepMs = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  await sleepMs(120); // Simulates uniform hashing cost across valid & invalid attempts

  // Generic error protection: Check both fields without leaking whether email exists
  const isEmailValid = email === VALID_USER.email;
  const isPasswordValid = password === 'FirstPrinciples2026!';

  if (!isEmailValid || !isPasswordValid) {
    const elapsed = Math.round(performance.now() - startTime);
    return res.status(401).json({
      error: "Invalid email or password",
      _securityNote: "Generic error returned in constant time (~120ms) to prevent username enumeration and timing attacks."
    });
  }

  // Issue Session ID (Stateful)
  const sessionId = 'sess_' + crypto.randomBytes(16).toString('hex');
  sessionStore.set(sessionId, {
    userId: VALID_USER.userId,
    role: VALID_USER.role,
    email: VALID_USER.email,
    createdAt: Date.now()
  });

  // Issue JWT (Stateless)
  const tokenPayload = {
    sub: VALID_USER.userId,
    email: VALID_USER.email,
    role: VALID_USER.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour expiration
  };
  const token = createJwt(tokenPayload);

  return res.status(200).json({
    message: "Authentication successful",
    authMechanismComparison: {
      statelessJwt: {
        token,
        structure: {
          header: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
          payload: tokenPayload,
          signature: "[HMAC-SHA256 Secret Verified]"
        },
        usage: "Send in header: 'Authorization: Bearer <token>'"
      },
      statefulSession: {
        sessionId,
        storageLocation: "Server In-Memory / Redis Store",
        cookieDirective: `Set-Cookie: sessionId=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Strict`
      }
    }
  });
});

// 2. JWT Verification & Inspection
router.post('/auth/verify-jwt', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization || '';
  const bodyToken = req.body?.token;
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : (bodyToken || '');

  if (!token) {
    return res.status(400).json({
      error: "No JWT token provided. Send 'Authorization: Bearer <token>' or { token: '...' } in request body."
    });
  }

  const result = verifyJwt(token);

  if (!result.valid) {
    return res.status(401).json({
      status: "unauthorized",
      valid: false,
      reason: result.reason,
      _firstPrinciple: "The server verified the cryptographic HMAC signature using its internal secret key without touching a database."
    });
  }

  return res.status(200).json({
    status: "authenticated",
    valid: true,
    decodedClaims: result.payload,
    _firstPrinciple: "Signature valid! Claims decoded safely in memory with zero database latency."
  });
});

// 3. RBAC (Role-Based Access Control) Enforcement
router.post('/auth/rbac-guard', (req: Request, res: Response) => {
  const { role, action } = req.body || {};

  // Permissions matrix
  const permissions: Record<string, string[]> = {
    viewer: ['read_articles', 'read_comments'],
    editor: ['read_articles', 'read_comments', 'create_articles', 'edit_articles'],
    admin: ['read_articles', 'read_comments', 'create_articles', 'edit_articles', 'delete_database', 'manage_users']
  };

  const currentRole = (role || 'viewer').toLowerCase();
  const allowedActions = permissions[currentRole] || [];
  const requestedAction = action || 'read_articles';

  const isAuthorized = allowedActions.includes(requestedAction);

  if (!isAuthorized) {
    return res.status(403).json({
      statusCode: 403,
      error: "403 Forbidden",
      message: `Role '${currentRole}' lacks permission for action '${requestedAction}'.`,
      roleCapabilities: allowedActions,
      _difference401vs403: "401 means unauthenticated ('Who are you?'); 403 means authenticated but unauthorized ('You cannot do this')."
    });
  }

  return res.status(200).json({
    statusCode: 200,
    status: "Access Granted",
    role: currentRole,
    executedAction: requestedAction,
    allowedPermissions: allowedActions
  });
});

export default router;
