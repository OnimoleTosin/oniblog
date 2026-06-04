import { TRPCError } from '@trpc/server';
import { verifyIdToken, initializeFirebaseAdmin } from '../firebase-admin';
import type { TrpcContext } from './context';

/**
 * Extract Firebase ID token from Authorization header
 */
export function extractFirebaseToken(req: any): string | null {
  const authHeader = req.headers?.authorization;
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

  return parts[1];
}

/**
 * Verify Firebase token and return user data
 */
export async function verifyFirebaseAuth(token: string): Promise<any> {
  try {
    // Ensure Firebase Admin is initialized
    await initializeFirebaseAdmin();
    
    const decodedToken = await verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name,
      photoURL: decodedToken.picture || null,
    };
  } catch (error) {
    console.error('[Firebase Auth] Verification failed:', error);
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid or expired authentication token',
    });
  }
}

/**
 * Middleware to attach Firebase user to context
 */
export async function attachFirebaseUser(ctx: TrpcContext): Promise<any> {
  const token = extractFirebaseToken(ctx.req);
  
  if (!token) {
    return null;
  }

  try {
    const firebaseUser = await verifyFirebaseAuth(token);
    return firebaseUser;
  } catch (error) {
    console.error('[Firebase Middleware] Failed to attach user:', error);
    return null;
  }
}
