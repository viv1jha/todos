// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

// Project's Firebase configuration (taken from public/firebase-messaging-sw.js)
const firebaseConfig = {
  apiKey: "AIzaSyBb18dFEugSNpCye_CAMCRRyQm00_KO7e0",
  authDomain: "to-dolist-83920.firebaseapp.com",
  projectId: "to-dolist-83920",
  storageBucket: "to-dolist-83920.firebasestorage.app",
  messagingSenderId: "956562472595",
  appId: "1:956562472595:web:39fbb1706daece64541766",
  measurementId: "G-YE2ZWHZGV9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let messaging;
try {
  messaging = getMessaging(app);
} catch (e) {
  // Messaging may not be available in some environments (e.g., SSR or unsupported browsers)
  console.warn('Firebase messaging not available:', e.message);
}

export { auth, db, messaging };