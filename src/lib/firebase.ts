
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, indexedDBLocalPersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDWKx8IBFIeMfMuACHVL3YbC9jsnPvLo1o",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "shilpik-elegant-ethnic-fashion.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "shilpik-elegant-ethnic-fashion",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "shilpik-elegant-ethnic-fashion.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "253622306540",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:253622306540:web:19dc5704941c02dc89c7c9",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ""
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Use indexedDB for persistence
const auth = initializeAuth(app, {
    persistence: indexedDBLocalPersistence
});

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
