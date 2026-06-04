import type * as AdminType from 'firebase-admin';

// Initialize Firebase Admin SDK
// Note: This uses the default credentials from the environment
// For production, ensure GOOGLE_APPLICATION_CREDENTIALS env var points to your service account JSON

let adminApp: any = null;
let adminAuth: any = null;
let initializationError: Error | null = null;
let adminModule: any = null;

async function loadFirebaseAdmin() {
  if (adminModule) {
    return adminModule;
  }

  try {
    // Dynamically import firebase-admin for ES module compatibility
    const imported = await import('firebase-admin');
    adminModule = imported.default || imported;
    return adminModule;
  } catch (error) {
    console.error('[Firebase Admin] Failed to load module:', error);
    throw error;
  }
}

export async function initializeFirebaseAdmin() {
  if (adminApp) {
    return adminApp;
  }

  if (initializationError) {
    throw initializationError;
  }

  try {
    const admin = await loadFirebaseAdmin();

    // Check if admin SDK is properly imported
    if (typeof admin.initializeApp !== 'function') {
      throw new Error('Firebase Admin SDK not properly loaded');
    }

    // Try to initialize with projectId only (uses default credentials)
    adminApp = admin.initializeApp({
      projectId: 'soulcircleauth',
    });
    console.log('[Firebase Admin] Initialized successfully with projectId');
    return adminApp;
  } catch (error: any) {
    console.error('[Firebase Admin] Failed to initialize:', error);
    initializationError = error;
    
    // Continue without Firebase Admin - public procedures will still work
    console.warn('[Firebase Admin] Using fallback mode - token verification will be limited');
    return null;
  }
}

export async function getFirebaseAuth() {
  try {
    if (!adminAuth) {
      if (!adminApp) {
        await initializeFirebaseAdmin();
      }
      
      if (!adminApp) {
        throw new Error('Firebase Admin not initialized');
      }

      const admin = await loadFirebaseAdmin();
      adminAuth = admin.auth();
    }
    
    return adminAuth;
  } catch (error) {
    console.error('[Firebase Admin] Failed to get auth:', error);
    throw error;
  }
}

/**
 * Verify Firebase ID token
 */
export async function verifyIdToken(token: string): Promise<any> {
  try {
    const auth = await getFirebaseAuth();
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
    const auth = await getFirebaseAuth();
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
