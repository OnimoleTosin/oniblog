import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { extractFirebaseToken, verifyFirebaseAuth } from '../server/_core/firebase-middleware';
import { TRPCError } from '@trpc/server';

describe('Firebase Auth Middleware', () => {
  describe('extractFirebaseToken', () => {
    it('should extract token from valid Authorization header', () => {
      const req = {
        headers: {
          authorization: 'Bearer test-token-123',
        },
      };
      const token = extractFirebaseToken(req);
      expect(token).toBe('test-token-123');
    });

    it('should return null for missing Authorization header', () => {
      const req = { headers: {} };
      const token = extractFirebaseToken(req);
      expect(token).toBeNull();
    });

    it('should return null for malformed Authorization header', () => {
      const req = {
        headers: {
          authorization: 'InvalidFormat test-token',
        },
      };
      const token = extractFirebaseToken(req);
      expect(token).toBeNull();
    });

    it('should return null for missing Bearer prefix', () => {
      const req = {
        headers: {
          authorization: 'test-token-123',
        },
      };
      const token = extractFirebaseToken(req);
      expect(token).toBeNull();
    });

    it('should handle missing headers object', () => {
      const req = {};
      const token = extractFirebaseToken(req);
      expect(token).toBeNull();
    });
  });

  describe('verifyFirebaseAuth', () => {
    it('should throw UNAUTHORIZED error on verification failure', async () => {
      const invalidToken = 'invalid-token';
      
      try {
        await verifyFirebaseAuth(invalidToken);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        if (error instanceof TRPCError) {
          expect(error.code).toBe('UNAUTHORIZED');
          expect(error.message).toContain('Invalid or expired');
        }
      }
    });

    it('should handle network errors gracefully', async () => {
      const token = 'network-error-token';
      
      try {
        await verifyFirebaseAuth(token);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
      }
    });
  });
});
