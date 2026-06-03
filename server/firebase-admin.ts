import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
// Note: This uses the default credentials from the environment
// For production, ensure GOOGLE_APPLICATION_CREDENTIALS env var points to your service account JSON

let adminApp: admin.app.App | null = null;

export function initializeFirebaseAdmin() {
  if (adminApp) {
    return adminApp;
  }

  try {
    adminApp = admin.initializeApp({
      projectId: 'soulcircleauth',
    });
    console.log('[Firebase Admin] Initialized successfully');
    return adminApp;
  } catch (error) {
    console.error('[Firebase Admin] Failed to initialize:', error);
    throw error;
  }
}

export function getFirebaseAuth() {
  if (!adminApp) {
    initializeFirebaseAdmin();
  }
  return admin.auth();
}

/**
 * Verify Firebase ID token
 */
export async function verifyIdToken(token: string): Promise<admin.auth.DecodedIdToken> {
  try {
    const auth = getFirebaseAuth();
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('[Firebase Admin] Token verification failed:', error);
    throw error;
  }
}

/**
 * Get or create user in database from Firebase user
 */
export async function syncFirebaseUser(uid: string, email?: string, displayName?: string) {
  try {
    const auth = getFirebaseAuth();
    const userRecord = await auth.getUser(uid);
    
    return {
      uid: userRecord.uid,
      email: userRecord.email || email,
      displayName: userRecord.displayName || displayName,
      photoURL: userRecord.photoURL || null,
    };
  } catch (error) {
    console.error('[Firebase Admin] Failed to sync user:', error);
    throw error;
  }
}
