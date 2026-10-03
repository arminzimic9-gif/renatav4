import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// TODO: Replace with your actual Firebase config from the Firebase Console
// Project ID: habitplus-36217
const firebaseConfig = {
  apiKey: "AIzaSyBDvtyIHpQoYgH7ii1ABcUs8IFxaHOpK30",
  authDomain: "habitplus-36217.firebaseapp.com",
  projectId: "habitplus-36217",
  storageBucket: "habitplus-36217.firebasestorage.app",
  messagingSenderId: "745917890278",
  appId: "1:745917890278:web:bea8e72dcd7e4b4f708527",
  measurementId: "G-6CPD58SRZQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
