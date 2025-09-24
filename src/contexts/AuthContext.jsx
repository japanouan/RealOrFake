import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, fs } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if Firestore is available
  const isFirestoreAvailable = () => {
    try {
      return db && typeof db === 'object';
    } catch (error) {
      console.error('Firestore not available:', error);
      return false;
    }
  };

  // Register new user
  async function register(email, password, username, role = 'user') {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: username
      });

      // Create user document in Firestore with role
      await setDoc(doc(fs, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: email,
        username: username,
        role: role,
        createdAt: new Date(),
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

  // Get user role from Firestore
  async function getUserRole(uid) {
    try {
      // Check if Firestore is available
      if (!isFirestoreAvailable()) {
        console.log('Firestore not available, using email-based role detection');
        const userEmail = auth.currentUser?.email || '';
        return userEmail.toLowerCase().includes('admin') ? 'admin' : 'user';
      }

      const userRef = doc(fs, 'users', uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const email = auth.currentUser?.email?.toLowerCase() || '';
        // Auto-elevate admin account if needed
        if (email === 'admin888@gmail.com' && userData.role !== 'admin') {
          await setDoc(userRef, { role: 'admin' }, { merge: true });
          return 'admin';
        }
        return userData.role || 'user';
      }
      
      // If user document doesn't exist, create it with appropriate role
      console.log('User document not found, creating default user document...');
      const userEmail = auth.currentUser?.email || '';
      const defaultRole = userEmail.toLowerCase().includes('admin') ? 'admin' : 'user';
      console.log('Creating user document with email:', userEmail, 'role:', defaultRole);
      
      await setDoc(userRef, {
        uid: uid,
        email: userEmail,
        username: auth.currentUser?.displayName || 'User',
        role: defaultRole,
        createdAt: new Date(),
        stats: {
          totalQuestions: 0,
          correctAnswers: 0,
          accuracy: 0,
          streak: 0,
          badges: []
        }
      });
      
      return defaultRole; // Return the appropriate role
    } catch (error) {
      console.error('Error getting user role:', error);
      return 'user';
    }
  }

  // Update user stats
  async function updateUserStats(uid, stats) {
    try {
      await setDoc(doc(fs, 'users', uid), {
        stats: stats
      }, { merge: true });
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setCurrentUser(user);
          // Get user role from Firestore with timeout
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
            setUserRole('user'); // Default role on error
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

    // Fallback timeout to prevent infinite loading
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
