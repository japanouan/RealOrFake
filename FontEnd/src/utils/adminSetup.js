// Utility to create the first admin user
// Run this in browser console after setting up Firebase Auth

import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

export async function createAdminUser(email, password, username) {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update display name
    await updateProfile(userCredential.user, {
      displayName: username
    });

    // Create user document with admin role
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      uid: userCredential.user.uid,
      email: email,
      username: username,
      role: 'admin',
      createdAt: new Date(),
      stats: {
        totalQuestions: 0,
        correctAnswers: 0,
        accuracy: 0,
        streak: 0,
        badges: []
      }
    });

    console.log('Admin user created successfully:', userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

// Example usage:
// createAdminUser('admin@example.com', 'admin123', 'Admin User');
