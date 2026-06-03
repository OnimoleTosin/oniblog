import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDUgLotIZK79WZRmwX9dnJeNhYSyXUy_ws",
  authDomain: "soulcircleauth.firebaseapp.com",
  projectId: "soulcircleauth",
  storageBucket: "soulcircleauth.firebasestorage.app",
  messagingSenderId: "565162650503",
  appId: "1:565162650503:web:46c7db5dd3ab3c9ba98122",
  measurementId: "G-TRVR8Q4Z5T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Set persistence to LOCAL (survives page refresh)
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

export default app;
