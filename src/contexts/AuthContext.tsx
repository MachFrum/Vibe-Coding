
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
// When you implement real Firebase, you'll import User from "firebase/auth"
// import type { User } from 'firebase/auth';
import { mockOnAuthStateChanged, type MockUser as User } from '@/lib/firebase'; // Using MockUser as User for now
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  // Add other auth related functions if needed, e.g., signInWithGoogle, updateUserProfile
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // In a real app, this would be auth.onAuthStateChanged from Firebase SDK
    const unsubscribe = mockOnAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !currentUser && !pathname.startsWith('/auth')) {
      if (pathname !== '/') { // Allow access to home page if it's public
         // router.push('/auth/signin'); // Protect non-auth routes
      }
    }
  }, [currentUser, loading, router, pathname]);


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
