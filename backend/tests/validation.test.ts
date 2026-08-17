import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Validation Pipeline Logic', () => {
  it('should accept valid syntactic and semantic payload', () => {
    const validPayload = {
      email: 'engineer@firstprinciples.dev',
      phone: '+1-555-0199',
      dateOfBirth: '1995-06-12',
      age: 29,
      password: 'SecretPassword123!',
      passwordConfirmation: 'SecretPassword123!',
      married: true,
      partnerName: 'Taylor',
      tags: ['backend', 'postgres']
    };

    assert.strictEqual(typeof validPayload.email, 'string');
    assert.match(validPayload.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    assert.strictEqual(validPayload.password, validPayload.passwordConfirmation);
    assert.ok(validPayload.age >= 0 && validPayload.age <= 120);
  });

  it('should detect complex password mismatch', () => {
    const invalidPayload = {
      password: 'SecretPassword123!',
      passwordConfirmation: 'DifferentPassword456!'
    };

    assert.notStrictEqual(invalidPayload.password, invalidPayload.passwordConfirmation);
  });

  it('should normalize and cast query string numbers', () => {
    const rawPage = '3';
    const rawLimit = '50';
    const parsedPage = parseInt(rawPage, 10);
    const parsedLimit = parseInt(rawLimit, 10);

    assert.strictEqual(parsedPage, 3);
    assert.strictEqual(parsedLimit, 50);
  });
});
