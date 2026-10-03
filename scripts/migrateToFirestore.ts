/**
 * Migration script: translations.ts → Firestore
 * 
 * Runs via: npx tsx scripts/migrateToFirestore.ts
 * 
 * This script reads all existing translations from translations.ts and writes them
 * to Firestore at `website_content/translations`. Run only ONCE or when you need
 * to reset Firestore data to the code-defined default.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { translations } from '../translations';

const firebaseConfig = {
  apiKey: "AIzaSyBDvtyIHpQoYgH7ii1ABcUs8IFxaHOpK30",
  authDomain: "habitplus-36217.firebaseapp.com",
  projectId: "habitplus-36217",
  storageBucket: "habitplus-36217.firebasestorage.app",
  messagingSenderId: "745917890278",
  appId: "1:745917890278:web:bea8e72dcd7e4b4f708527",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrate() {
  console.log('🚀 Starting migration: translations.ts → Firestore...');
  console.log(`📦 Data size: ${JSON.stringify(translations).length} bytes`);

  try {
    const docRef = doc(db, 'website_content', 'translations');
    await setDoc(docRef, translations as any, { merge: false });
    console.log('✅ Migration successful!');
    console.log('📍 Written to: website_content/translations');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

migrate();
