// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDpPett17WF-zpLK4rLzx1cKC5je3Bh6UE",
  authDomain: "money-49d6c.firebaseapp.com",
  projectId: "money-49d6c",
  storageBucket: "money-49d6c.firebasestorage.app",
  messagingSenderId: "173856684584",
  appId: "1:173856684584:web:4fca57d6ca185eec2e531d",
  measurementId: "G-YH5NCKHWXV"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);