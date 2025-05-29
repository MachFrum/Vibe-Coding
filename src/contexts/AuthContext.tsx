
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
// When you implement real Firebase, you'll import User from "firebase/auth"
// import type { User } from 'firebase/auth';
import { mockOnAuthStateChanged, type MockUser as User } from '@/lib/firebase'; // Using MockUser as User for now
// Removed useRouter and usePathname as they are not needed here

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  // Add other auth related functions if needed, e.g., signInWithGoogle, updateUserProfile
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Removed router and pathname states as they are not managed by this context

  useEffect(() => {
    // In a real app, this would be auth.onAuthStateChanged from Firebase SDK
    const unsubscribe = mockOnAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Removed the useEffect hook that was handling routing logic.
  // Routing and route protection should be handled by layouts or pages.

  const value = {
    currentUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
