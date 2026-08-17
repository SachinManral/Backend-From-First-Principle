import { Router, Request, Response } from 'express';

const router = Router();

/**
 * ============================================================================
 * FIRST PRINCIPLE: VALIDATIONS & TRANSFORMATIONS (Lecture 9)
 * 
 * 1. Entry Point Protection:
 *    Validations and transformations happen immediately in the Controller layer,
 *    after route matching and before any business logic or database queries run.
 * 
 * 2. 400 Bad Request vs. 500 Crash:
 *    Unvalidated data reaching PostgreSQL or SQLite causes schema constraint
 *    violations and unhandled 500 Internal Server Errors. Validating at the
 *    entry point produces clean, actionable 400 Bad Request field errors.
 * 
 * 3. Four Core Validation Types:
 *    - Type Validation: Primitive types (string, number, boolean, array, object)
 *    - Syntactic Validation: Format patterns (email, phone, ISO date)
 *    - Semantic Validation: Logical real-world rules (DOB not in future, age <= 120)
 *    - Complex / Dependent Validation: Cross-field rules (confirmPassword === password, partnerName required if married === true)
 * 
 * 4. Transformation & Type Casting:
 *    Converting query strings (?page=2) into numbers, lowercasing emails,
 *    and normalizing phone numbers before business layer execution.
 * ============================================================================
 */

interface ValidationError {
  field: string;
  expected: string;
  received: string | null;
  message: string;
  type: 'type' | 'syntactic' | 'semantic' | 'complex';
}


/**
 * 1. POST /api/demo/validation/pipeline
 * Multi-layer validation pipeline testing Type, Syntactic, Semantic, and Complex constraints.
 */
router.post('/pipeline', (req: Request, res: Response) => {
  const errors: ValidationError[] = [];
  const body = req.body || {};

  // ─── A. SYNTACTIC & TYPE VALIDATION ───
  // 1. Email (Syntactic + Type)
  if (body.email === undefined || body.email === null || body.email === '') {
    errors.push({
      field: 'email',
      expected: 'valid email string (e.g. user@example.com)',
      received: typeof body.email === 'string' ? '""' : typeof body.email,
      message: 'Email field is required',
      type: 'type'
    });
  } else if (typeof body.email !== 'string') {
    errors.push({
      field: 'email',
      expected: 'string',
      received: typeof body.email,
      message: `Expected string for email, received ${typeof body.email}`,
      type: 'type'
    });
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      errors.push({
        field: 'email',
        expected: 'user@domain.tld pattern',
        received: body.email,
        message: 'Invalid email format (missing @ or valid domain)',
        type: 'syntactic'
      });
    }
  }

  // 2. Phone (Syntactic)
  if (body.phone !== undefined && body.phone !== null && body.phone !== '') {
    if (typeof body.phone !== 'string') {
      errors.push({
        field: 'phone',
        expected: 'string (e.g. "+1-555-0199")',
        received: typeof body.phone,
        message: `Expected string for phone number, received ${typeof body.phone}`,
        type: 'type'
      });
    } else {
      const phoneClean = body.phone.replace(/[\s\-\(\)]/g, '');
      if (!/^\+?[0-9]{7,15}$/.test(phoneClean)) {
        errors.push({
          field: 'phone',
          expected: '7-15 digit phone number with optional + country code',
          received: body.phone,
          message: 'Invalid phone number format',
          type: 'syntactic'
        });
      }
    }
  }

  // ─── B. SEMANTIC VALIDATION ───
  // 3. Date of Birth & Age (Semantic rules)
  if (body.dateOfBirth) {
    const parsedDate = new Date(body.dateOfBirth);
    if (isNaN(parsedDate.getTime())) {
      errors.push({
        field: 'dateOfBirth',
        expected: 'valid ISO date string (YYYY-MM-DD)',
        received: String(body.dateOfBirth),
        message: 'Invalid date format for dateOfBirth',
        type: 'syntactic'
      });
    } else if (parsedDate.getTime() > Date.now()) {
      errors.push({
        field: 'dateOfBirth',
        expected: 'past date',
        received: body.dateOfBirth,
        message: 'Date of birth cannot be in the future',
        type: 'semantic'
      });
    }
  }

  if (body.age !== undefined && body.age !== null) {
    if (typeof body.age !== 'number' || isNaN(body.age)) {
      errors.push({
        field: 'age',
        expected: 'number',
        received: typeof body.age,
        message: `Expected number for age, received ${typeof body.age}`,
        type: 'type'
      });
    } else if (body.age < 0 || body.age > 120) {
      errors.push({
        field: 'age',
        expected: 'integer between 0 and 120',
        received: String(body.age),
        message: 'Age must be a logical human lifespan between 0 and 120',
        type: 'semantic'
      });
    }
  }

  // ─── C. COMPLEX (DEPENDENT) VALIDATION ───
  // 4. Password Confirmation Check
  if (body.password !== undefined) {
    if (typeof body.password !== 'string' || body.password.length < 8) {
      errors.push({
        field: 'password',
        expected: 'string with at least 8 characters',
        received: typeof body.password === 'string' ? `${body.password.length} chars` : typeof body.password,
        message: 'Password must contain at least 8 characters',
        type: 'type'
      });
    }

    if (body.passwordConfirmation !== body.password) {
      errors.push({
        field: 'passwordConfirmation',
        expected: 'exact match with password field',
        received: body.passwordConfirmation ? '[mismatch]' : 'missing',
        message: 'Password confirmation does not match password',
        type: 'complex'
      });
    }
  }

  // 5. Conditional Married -> Partner Name Requirement
  if (body.married === true) {
    if (!body.partnerName || typeof body.partnerName !== 'string' || body.partnerName.trim().length === 0) {
      errors.push({
        field: 'partnerName',
        expected: 'non-empty string when married is true',
        received: body.partnerName || 'undefined',
        message: 'Partner name is required when married status is true',
        type: 'complex'
      });
    }
  }

  // ─── D. RECURSIVE ARRAY ELEMENT VALIDATION ───
  if (body.tags !== undefined) {
    if (!Array.isArray(body.tags)) {
      errors.push({
        field: 'tags',
        expected: 'array of strings',
        received: typeof body.tags,
        message: 'Tags must be an array',
        type: 'type'
      });
    } else {
      body.tags.forEach((tag: any, idx: number) => {
        if (typeof tag !== 'string') {
          errors.push({
            field: `tags[${idx}]`,
            expected: 'string',
            received: typeof tag,
            message: `Element at index ${idx} in tags must be a string, received ${typeof tag}`,
            type: 'type'
          });
        }
      });
    }
  }

  // Verdict Response
  if (errors.length > 0) {
    return res.status(400).json({
      status: 400,
      verdict: 'REJECTED_AT_CONTROLLER_ENTRYPOINT',
      errorCount: errors.length,
      explanation: 'Pipeline rejected the payload before invoking any service layer methods or SQL database operations.',
      errors,
      simulatedDatabaseAction: 'CANCELLED (Database protected from schema type exceptions)'
    });
  }

  return res.status(200).json({
    status: 200,
    verdict: 'VALIDATION_PASSED',
    message: 'All type, syntactic, semantic, and complex constraints satisfied. Request forwarded to Service Layer.',
    sanitizedPayload: {
      email: body.email,
      phone: body.phone || null,
      dateOfBirth: body.dateOfBirth || null,
      age: body.age ?? null,
      married: Boolean(body.married),
      partnerName: body.partnerName || null,
      tags: body.tags || []
    },
    simulatedDatabaseAction: 'INSERT INTO users (...) VALUES (...) EXECUTED SUCCESSFULLY'
  });
});

/**
 * 2. POST /api/demo/validation/transform
 * Demonstrates query string casting, whitespace trimming, email lowercasing, and phone normalization.
 */
router.post('/transform', (req: Request, res: Response) => {
  const rawPayload = req.body || {};

  // Step 1: Type Casting & Normalization
  const rawPage = rawPayload.page ?? '1';
  const rawLimit = rawPayload.limit ?? '20';
  const rawEmail = rawPayload.email ?? '';
  const rawPhone = rawPayload.phone ?? '';

  // Cast strings to integers
  const pageNumber = typeof rawPage === 'number' ? rawPage : parseInt(String(rawPage), 10);
  const limitNumber = typeof rawLimit === 'number' ? rawLimit : parseInt(String(rawLimit), 10);

  // Normalize Email (Trim + Lowercase)
  const normalizedEmail = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';

  // Normalize Phone (Prepend + if missing and digits only)
  let normalizedPhone = typeof rawPhone === 'string' ? rawPhone.trim() : '';
  if (normalizedPhone && !normalizedPhone.startsWith('+')) {
    normalizedPhone = `+${normalizedPhone}`;
  }

  // Validate transformed values
  const transformErrors: string[] = [];
  if (isNaN(pageNumber) || pageNumber < 1) {
    transformErrors.push('Transformed page number must be an integer >= 1');
  }
  if (isNaN(limitNumber) || limitNumber < 1 || limitNumber > 100) {
    transformErrors.push('Transformed limit number must be an integer between 1 and 100');
  }

  if (transformErrors.length > 0) {
    return res.status(400).json({
      status: 400,
      verdict: 'TRANSFORMATION_VALIDATION_FAILED',
      errors: transformErrors
    });
  }

  return res.status(200).json({
    status: 200,
    verdict: 'TRANSFORMATION_AND_NORMALIZATION_SUCCESS',
    pipelineComparison: {
      rawInput: {
        page: rawPage,
        limit: rawLimit,
        email: rawEmail,
        phone: rawPhone
      },
      transformedOutput: {
        page: pageNumber,
        limit: limitNumber,
        email: normalizedEmail,
        phone: normalizedPhone
      }
    },
    transformationsApplied: [
      { field: 'page', action: `Casted from "${typeof rawPage}" to numeric integer ${pageNumber}` },
      { field: 'limit', action: `Casted from "${typeof rawLimit}" to numeric integer ${limitNumber}` },
      { field: 'email', action: `Trimmed and lowercased ("${rawEmail}" -> "${normalizedEmail}")` },
      { field: 'phone', action: `Normalized E.164 format with international prefix ("${rawPhone}" -> "${normalizedPhone}")` }
    ],
    serviceLayerBenefit: 'The service layer receives clean, strongly-typed numbers and normalized strings, preventing database duplicates and query crashes.'
  });
});

export default router;
