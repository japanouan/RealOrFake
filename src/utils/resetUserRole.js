import { auth, db } from '../firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export async function resetUserRole() {
  try {
    if (auth.currentUser) {
      console.log('Resetting user role for:', auth.currentUser.email);
      
      // Delete existing user document
      await deleteDoc(doc(db, 'users', auth.currentUser.uid));
      console.log('User document deleted successfully');
      
      // Reload the page to trigger re-authentication
      window.location.reload();
    }
  } catch (error) {
    console.error('Error resetting user role:', error);
  }
}

// Function to manually set admin role
export async function setAdminRole(userId, isAdmin = true) {
  try {
    const { doc, setDoc } = await import('firebase/firestore');
    
    await setDoc(doc(db, 'users', userId), {
      role: isAdmin ? 'admin' : 'user'
    }, { merge: true });
    
    console.log('User role updated successfully');
  } catch (error) {
    console.error('Error updating user role:', error);
  }
}
