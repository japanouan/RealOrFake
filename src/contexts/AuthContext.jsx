import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { getDatabase, ref, set, get, update, child } from 'firebase/database';
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

  // Register new user
  async function register(email, password, username, role = 'user') {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // อัปเดต displayName ใน Firebase Auth
    await updateProfile(userCredential.user, { displayName: username });

    // ดึงค่าที่อัปเดตแล้วมาใช้
    const finalDisplayName = userCredential.user.displayName || username;

    // สร้าง user document ใน Realtime Database
    await set(ref(db, 'users/' + userCredential.user.uid), {
      uid: userCredential.user.uid,
      email: email,
      displayName: finalDisplayName,   // 👈 ใช้ displayName ตาม rules
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

    return userCredential;
  } catch (error) {
    throw error;
  }
}


  // Login user
  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  // Logout user
  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  }

  // Get user role from Realtime Database
  async function getUserRole(uid) {
    try {
      const snapshot = await get(child(ref(db), 'users/' + uid));
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const email = auth.currentUser?.email?.toLowerCase() || '';

        // Auto-elevate admin account
        if (email === 'admin888@gmail.com' && userData.role !== 'admin') {
          await update(ref(db, 'users/' + uid), { role: 'admin' });
          return 'admin';
        }
        return userData.role || 'user';
      }

      // If user not exist → create with default role
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

  // Update user stats
  async function updateUserStats(uid, stats) {
    try {
      await update(ref(db, 'users/' + uid + '/stats'), stats);
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setCurrentUser(user);
          try {
            const role = await Promise.race([
              getUserRole(user.uid),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), 10000)
              )
            ]);
            setUserRole(role);
          } catch (error) {
            console.error('Error getting user role:', error);
            setUserRole('user');
          }
        } else {
          setCurrentUser(null);
          setUserRole(null);
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
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'var(--gray-50)',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{
            fontSize: '3rem',
            animation: 'spin 1s linear infinite'
          }}>⏳</div>
          <div style={{
            fontSize: '1.2rem',
            color: 'var(--gray-600)',
            fontWeight: '500'
          }}>กำลังโหลด...</div>
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
