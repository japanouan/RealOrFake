// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_VycM7zniO7ti64Bb-Yn1rfw5SUyDmg8",
  authDomain: "pattern-3d1a8.firebaseapp.com",
  projectId: "pattern-3d1a8",
  storageBucket: "pattern-3d1a8.firebasestorage.app",
  messagingSenderId: "51744145096",
  appId: "1:51744145096:web:1560f343f029b4a9e2affd",
  measurementId: "G-BV5J4C9NK9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Analytics ใช้ได้เฉพาะใน browser
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, auth, db, analytics };
