import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  connectAuthEmulator,
} from 'firebase/auth';
import { auth as firebaseAuth, googleProvider } from './firebase';

export { firebaseAuth as auth };

const auth = firebaseAuth;

// Maximum retry attempts for network failures
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

/**
 * Retry helper for network failures
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = MAX_RETRIES
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Only retry on network errors
      if (
        error?.code === 'auth/network-request-failed' ||
        error?.message?.includes('network')
      ) {
        if (i < maxRetries - 1) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (i + 1)));
          continue;
        }
      } else {
        // Don't retry on non-network errors
        throw error;
      }
    }
  }
  
  throw lastError;
}

/**
 * Initialize Firebase persistence
 */
export async function initializeFirebasePersistence(): Promise<void> {
  try {
    await setPersistence(auth, browserLocalPersistence);
    console.log('[Firebase] Persistence initialized');
  } catch (error) {
    console.error('[Firebase] Error setting persistence:', error);
  }
}

/**
 * Sign up with email and password
 */
export const signUp = async (email: string, password: string, displayName?: string): Promise<AuthUser> => {
  try {
    await initializeFirebasePersistence();
    
    const userCredential = await withRetry(() =>
      createUserWithEmailAndPassword(auth, email, password)
    );
    const user = userCredential.user;

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || displayName || null,
      photoURL: user.photoURL,
    };
  } catch (error: any) {
    console.error('[Firebase] Sign up error:', error);
    throw error;
  }
};

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string): Promise<AuthUser> => {
  try {
    await initializeFirebasePersistence();
    
    const userCredential = await withRetry(() =>
      signInWithEmailAndPassword(auth, email, password)
    );
    const user = userCredential.user;

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  } catch (error: any) {
    console.error('[Firebase] Sign in error:', error);
    throw error;
  }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async (): Promise<AuthUser> => {
  try {
    await initializeFirebasePersistence();
    
    // Set custom parameters for Google Sign-in
    googleProvider.setCustomParameters({
      prompt: 'select_account',
    });

    const result = await withRetry(() =>
      signInWithPopup(auth, googleProvider)
    );
    const user = result.user;

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  } catch (error: any) {
    console.error('[Firebase] Google sign in error:', error);
    
    // Provide more helpful error messages
    if (error?.code === 'auth/popup-blocked') {
      throw new Error('Popup was blocked. Please allow popups and try again.');
    } else if (error?.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in was cancelled.');
    } else if (error?.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    throw error;
  }
};

/**
 * Sign out
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log('[Firebase] Logged out successfully');
  } catch (error) {
    console.error('[Firebase] Sign out error:', error);
    throw error;
  }
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  return firebaseAuth.currentUser;
};

/**
 * Get ID token for backend verification
 */
export const getIdToken = async (): Promise<string | null> => {
  try {
    const user = firebaseAuth.currentUser;
    if (user) {
      return await user.getIdToken(true); // Force refresh
    }
    return null;
  } catch (error) {
    console.error('[Firebase] Error getting ID token:', error);
    return null;
  }
};

/**
 * Subscribe to auth state changes
 */
export const subscribeToAuthState = (callback: (user: AuthUser | null) => void): (() => void) => {
  return onAuthStateChanged(firebaseAuth, (user) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
    } else {
      callback(null);
    }
  });
};
