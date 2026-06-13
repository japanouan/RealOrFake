// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
// Optional: export Firestore if needed elsewhere later
// import { getFirestore } from "firebase/firestore";

// ✅ ใช้ databaseURL ด้วย (Realtime Database ต้องมี)
const firebaseConfig = {
  apiKey: "AIzaSyA_VycM7zniO7ti64Bb-Yn1rfw5SUyDmg8",
  authDomain: "pattern-3d1a8.firebaseapp.com",
  databaseURL: "https://pattern-3d1a8-default-rtdb.asia-southeast1.firebasedatabase.app/", // 👈 เพิ่มบรรทัดนี้
  projectId: "pattern-3d1a8",
  storageBucket: "pattern-3d1a8.appspot.com", // 👈 ตรงนี้แก้จาก .app เป็น .appspot.com
  messagingSenderId: "51744145096",
  appId: "1:51744145096:web:1560f343f029b4a9e2affd",
  measurementId: "G-BV5J4C9NK9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);
const db = getDatabase(app);   // ✅ Realtime DB
const fs = getFirestore(app);  // ✅ Firestore

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, auth, db, fs, analytics };
