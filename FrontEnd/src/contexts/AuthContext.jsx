import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { getDatabase, ref, set, get, update, child, onDisconnect, onValue, serverTimestamp } from 'firebase/database';
import { auth } from '../firebase';

const db = getDatabase();
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // === 🧮 ฟังก์ชันคำนวณ streak ===
  function getCurrentStreakStatus(dateKeys = []) {
    if (!Array.isArray(dateKeys) || dateKeys.length === 0) return 0;
    const sortedDates = dateKeys
      .map((d) => new Date(d))
      .sort((a, b) => b - a); // จากล่าสุดไปเก่าสุด

    let streak = 1;
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const diffDays = (sortedDates[i] - sortedDates[i + 1]) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) streak++;
      else if (diffDays > 1) break;
    }
    return streak;
  }

  // === 🔥 ฟังก์ชันอัปเดต streak ===
  async function updateUserStreak(uid) {
    try {
      const userStatsRef = ref(db, `users/${uid}/stats`);
      const submissionHistoryRef = ref(db, `submissions/${uid}`);

      const [userStatsSnap, submissionHistorySnap] = await Promise.all([
        get(userStatsRef),
        get(submissionHistoryRef)
      ]);

      const currentUserStats = userStatsSnap.exists()
        ? userStatsSnap.val()
        : { accuracy: 0, correctAnswers: 0, streak: 0, totalQuestions: 0 };

      const submissionHistoryData = submissionHistorySnap.exists()
        ? submissionHistorySnap.val()
        : {};

      const dateKeys = Object.keys(submissionHistoryData);
      const streak = getCurrentStreakStatus(dateKeys);

      currentUserStats.streak = streak;

      await set(userStatsRef, currentUserStats);
      console.log('✅ Updated streak:', streak);
    } catch (error) {
      console.error('❌ Error updating streak:', error);
    }
  }

  // === 🧩 Register new user ===
  async function register(email, password, username, role = 'user') {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, { displayName: username });
      const finalDisplayName = userCredential.user.displayName || username;

      await set(ref(db, 'users/' + userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: email,
        displayName: finalDisplayName,
        role: role,
        createdAt: Date.now(),
        stats: {
          totalQuestions: 0,
          correctAnswers: 0,
          accuracy: 0,
          streak: 0,
          badges: []
        }
      });

      const userAggregateRef = ref(db, 'userAggregates/' + userCredential.user.uid);
      await set(userAggregateRef, {
        all: {
          attempts: 0,
          correct: 0,
          totalScore: 0
        },
        daily: {},
        updatedAt: Date.now()
      });

      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  // === 🧠 Login user (เพิ่มอัปเดต streak หลัง login) ===
  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      console.log('🔑 Login success for:', uid);
      await updateUserStreak(uid); // 👈 เรียกอัปเดต streak หลัง login สำเร็จ

      return userCredential;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  }

  // === 🚪 Logout user ===
  async function logout() {
    try {
      const uid = auth.currentUser?.uid;
      if (uid) {
        const statusRef = ref(db, 'users/' + uid + '/status');
        await set(statusRef, { state: 'unactive', lastChanged: serverTimestamp() });
        try {
          await onDisconnect(statusRef).cancel();
        } catch (_) { }
      }
      await signOut(auth);
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  }

  // === 🎭 Get user role ===
  async function getUserRole(uid) {
    try {
      const snapshot = await get(child(ref(db), 'users/' + uid));
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const email = auth.currentUser?.email?.toLowerCase() || '';

        if (email === 'admin888@gmail.com' && userData.role !== 'admin') {
          await update(ref(db, 'users/' + uid), { role: 'admin' });
          return 'admin';
        }
        return userData.role || 'user';
      }

      const userEmail = auth.currentUser?.email || '';
      const defaultRole = userEmail.toLowerCase().includes('admin') ? 'admin' : 'user';
      await set(ref(db, 'users/' + uid), {
        uid,
        email: userEmail,
        username: auth.currentUser?.displayName || 'User',
        role: defaultRole,
        createdAt: Date.now(),
        stats: {
          totalQuestions: 0,
          correctAnswers: 0,
          accuracy: 0,
          streak: 0,
          badges: []
        }
      });
      return defaultRole;
    } catch (error) {
      console.error('Error getting user role:', error);
      return 'user';
    }
  }

  // === 📊 Update user stats ===
  async function updateUserStats(uid, stats) {
    try {
      await update(ref(db, 'users/' + uid + '/stats'), stats);
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  }

  // === 👀 Watch auth state change ===
  useEffect(() => {
    let connectedUnsubscribe = null;
    let beforeUnloadHandler = null;

    function setupPresenceFor(uid) {
      const statusRef = ref(db, 'users/' + uid + '/status');
      const connectedRef = ref(db, '.info/connected');

      connectedUnsubscribe = onValue(connectedRef, async (snap) => {
        const isConnected = snap.val() === true;
        if (!isConnected) return;
        try {
          await onDisconnect(statusRef).set({ state: 'unactive', lastChanged: serverTimestamp() });
          await set(statusRef, { state: 'active', lastChanged: serverTimestamp() });
        } catch (e) {
          console.error('Error setting presence:', e);
        }
      });

      beforeUnloadHandler = () => {
        try {
          navigator?.sendBeacon?.('', '');
        } catch (_) { }
      };
      window.addEventListener('beforeunload', beforeUnloadHandler);
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setCurrentUser(user);
          console.log('👤 Auth state: logged in', user.uid);
          try {
            const role = await Promise.race([
              getUserRole(user.uid),
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout')), 10000)
              )
            ]);
            setUserRole(role);
            setupPresenceFor(user.uid);
          } catch (error) {
            console.error('Error getting user role:', error);
            setUserRole('user');
          }
        } else {
          console.log('🚫 Auth state: logged out');
          setCurrentUser(null);
          setUserRole(null);
          try {
            if (connectedUnsubscribe) connectedUnsubscribe();
          } catch (_) { }
          try {
            if (beforeUnloadHandler)
              window.removeEventListener('beforeunload', beforeUnloadHandler);
          } catch (_) { }
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setCurrentUser(null);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    });

    const timeoutId = setTimeout(() => {
      console.log('Auth loading timeout - setting loading to false');
      setLoading(false);
    }, 15000);

    return () => {
      unsubscribe();
      try {
        if (connectedUnsubscribe) connectedUnsubscribe();
      } catch (_) { }
      try {
        if (beforeUnloadHandler)
          window.removeEventListener('beforeunload', beforeUnloadHandler);
      } catch (_) { }
      clearTimeout(timeoutId);
    };
  }, []);

  const value = {
    currentUser,
    userRole,
    loading,
    register,
    login,
    logout,
    updateUserStats
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'var(--gray-50)',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <div
            style={{
              fontSize: '3rem',
              animation: 'spin 1s linear infinite'
            }}
          >
            ⏳
          </div>
          <div
            style={{
              fontSize: '1.2rem',
              color: 'var(--gray-600)',
              fontWeight: '500'
            }}
          >
            กำลังโหลด...
          </div>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
