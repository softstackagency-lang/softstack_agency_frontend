"use client";

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { authApi, userApi } from '@/lib/api';

export function useCustomAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Wait a bit to ensure Firebase auth is fully initialized
          await new Promise(resolve => setTimeout(resolve, 100));

          // Fetch complete user data from backend using UID
          const userData = await userApi.getUser(firebaseUser.uid);

          // Fetch user role
          try {
            const roleData = await userApi.getUserRole(firebaseUser.uid);
            if (roleData.success && roleData.data) {
              userData.role = roleData.data.role;
            }
          } catch (error) {
            // Keep the role from userData if role fetch fails
            userData.role = userData.role || 'user';
          }

          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data from backend:', error);

          // Try to fetch role separately even if main user fetch fails
          let userRole = 'user';
          try {
            const roleData = await userApi.getUserRole(firebaseUser.uid);
            if (roleData.success && roleData.data) {
              userRole = roleData.data.role;
            }
          } catch (roleError) {
            console.error('Error fetching user role:', roleError);
          }

          // If backend fails, use Firebase user data as fallback but preserve role
          const fallbackUser = {
            uid: firebaseUser.uid,
            firebaseUid: firebaseUser.uid,
            name: firebaseUser.displayName || '',
            displayName: firebaseUser.displayName || '',
            email: firebaseUser.email,
            phone: '',
            phoneNumber: '',
            address: '',
            image: firebaseUser.photoURL || '',
            photoURL: firebaseUser.photoURL || '',
            provider: 'google',
            role: userRole,
            status: 'active',
            termsAccepted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setUser(fallbackUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {

      // Sign out from Firebase
      await firebaseSignOut(auth);

      // Clear local state
      setUser(null);

      // Call backend logout API
      await authApi.logout();


      // Redirect to home page
      window.location.href = '/';

    } catch (error) {
      // Still redirect even if logout fails
      window.location.href = '/';
    }
  };

  return {
    user,
    loading,
    signOut
  };
}