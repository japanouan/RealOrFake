// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// ข้อมูลจาก Firebase Console ของคุณ
const firebaseConfig = {
  apiKey: "AIzaSy....",
  authDomain: "pattern-3d1a8.firebaseapp.com",
  projectId: "pattern-3d1a8",
  storageBucket: "pattern-3d1a8.appspot.com",
  messagingSenderId: "51744145096",
  appId: "1:51744145096:web:1506f343f029b4a9e2affd",
  measurementId: "G-BV5J4C9NK9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics ใช้ได้เฉพาะใน browser
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, analytics };
