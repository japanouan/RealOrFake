import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { app, analytics } from "./firebase";
import { AuthProvider } from "./contexts/AuthContext";

import NavBar from "./components/NavBar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import DailyChallenge from "./pages/DailyChallenge.jsx";
import Feedback from "./pages/Feedback.jsx";
import Review from "./pages/Review.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Learn from "./pages/Learn.jsx";
import Admin from "./pages/Admin.jsx";

function App() {
  useEffect(() => {
    console.log("Firebase App:", app);
    console.log("Analytics:", analytics);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Layout>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/challenge" element={
            <ProtectedRoute>
              <DailyChallenge />
            </ProtectedRoute>
          } />
          <Route path="/feedback" element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          } />
          <Route path="/review" element={
            <ProtectedRoute>
              <Review />
            </ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          } />
          <Route path="/learn" element={
            <ProtectedRoute>
              <Learn />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <Admin />
            </ProtectedRoute>
          } />
        </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
