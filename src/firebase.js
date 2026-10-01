import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * Firebase Configuration for Aastha General Store (Jaunpur, UP)
 * Values are injected through Vite environment variables.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

/**
 * Check if real Firebase environment credentials have been supplied.
 * If not, the application seamlessly activates graceful local storage fallback
 * so that developers and reviewers can test all UI and features immediately without errors.
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'YOUR_API_KEY' &&
  firebaseConfig.apiKey !== 'dummy_api_key' &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'YOUR_PROJECT_ID'
);

let app = null;
let auth = null;
let db = null;
let storage = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.info('[Firebase] Successfully initialized Firebase SDK for project:', firebaseConfig.projectId);
  } catch (error) {
    console.warn('[Firebase] Initialization error, falling back to local simulation mode:', error);
  }
} else {
  console.info('[Firebase] Credentials not detected in environment. Running in local fallback mode. See SETUP.md to connect live Firebase.');
}

// Firestore Collection Names constants
export const COLLECTIONS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  ORDERS: 'orders',
  USERS: 'users',
  ADMIN_USERS: 'admin_users',
};

// Admin Configuration
export const ADMIN_CREDENTIALS = {
  defaultEmail: import.meta.env.VITE_ADMIN_EMAIL || 'admin@aasthastore.com',
  defaultUsername: 'masterSam',
  storePhone: import.meta.env.VITE_STORE_PHONE || '919807329612',
  storeLocation: import.meta.env.VITE_STORE_LOCATION || 'Jaunpur, Uttar Pradesh',
};

export { app, auth, db, storage };
