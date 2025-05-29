
// TODO: Add your Firebase project configuration here
// See https://firebase.google.com/docs/web/setup#available-libraries

// Import the functions you need from the SDKs you need
// import { initializeApp, type FirebaseApp } from "firebase/app";
// import { getAuth, type Auth } from "firebase/auth";
// import { getFirestore, type Firestore } from "firebase/firestore";
// import { getStorage, type FirebaseStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, // Ensure these are in your .env.local
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: "G-XXXXXXXXXX" // Optional
};

// let app: FirebaseApp;
// let auth: Auth;
// let db: Firestore;
// let storage: FirebaseStorage;

// try {
//   app = initializeApp(firebaseConfig);
//   auth = getAuth(app);
//   db = getFirestore(app);
//   storage = getStorage(app);
//   console.log("Firebase initialized successfully");
// } catch (error) {
//   console.error("Firebase initialization error:", error);
//   // You might want to handle this error more gracefully in a real app
// }


// export { app, auth, db, storage };

// --- MOCK IMPLEMENTATIONS (Remove or replace with actual Firebase SDK calls) ---

import type { User } from "firebase/auth"; // Keep this type import

// Mock User type for prototyping
export interface MockUser extends User {
  // Add any custom properties if needed, e.g. from your Firestore user profile
  // For now, we'll just use the base User type from firebase/auth
}

export const mockSignInWithEmailAndPassword = async (email: string, pass: string): Promise<MockUser | null> => {
  console.log("Mock signInWithEmailAndPassword called with:", email, pass);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  if (email === "test@example.com" && pass === "password") {
    // Simulate successful sign-in for mockOnAuthStateChanged to pick up
    const mockUser = {
      uid: "mock-user-uid",
      email: "test@example.com",
      displayName: "Test User",
      emailVerified: true,
      isAnonymous: false,
      metadata: { creationTime: new Date().toISOString(), lastSignInTime: new Date().toISOString() },
      providerData: [],
      providerId: "password",
      tenantId: null,
      delete: async () => {},
      getIdToken: async () => "mock-id-token",
      getIdTokenResult: async () => ({ token: "mock-id-token", claims: {}, expirationTime: "", issuedAtTime: "", signInProvider: null, signInSecondFactor: null }),
      reload: async () => {},
      toJSON: () => ({}),
      photoURL: null,
      phoneNumber: null,
    } as MockUser;
    // Simulate updating the auth state for mockOnAuthStateChanged
    if (typeof window !== 'undefined') {
        (window as any).__mockCurrentUser = mockUser;
        (window as any).__triggerMockAuthStateChange(mockUser);
    }
    return mockUser;
  }
  throw new Error("Invalid credentials (mock)");
};

export const mockCreateUserWithEmailAndPassword = async (email: string, pass: string): Promise<MockUser | null> => {
  console.log("Mock createUserWithEmailAndPassword called with:", email, pass);
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Simulate successful creation
  return {
    uid: `new-mock-user-${Date.now()}`,
    email: email,
    displayName: email.split('@')[0], // Simple display name
    emailVerified: false,
    isAnonymous: false,
    metadata: { creationTime: new Date().toISOString(), lastSignInTime: new Date().toISOString() },
    providerData: [],
    providerId: "password",
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => "mock-new-user-id-token",
    getIdTokenResult: async () => ({ token: "mock-new-user-id-token", claims: {}, expirationTime: "", issuedAtTime: "", signInProvider: null, signInSecondFactor: null }),
    reload: async () => {},
    toJSON: () => ({}),
    photoURL: null,
    phoneNumber: null,
  } as MockUser;
};

export const mockSignOut = async (): Promise<void> => {
  console.log("Mock signOut called");
  await new Promise(resolve => setTimeout(resolve, 500));
   // Simulate updating the auth state for mockOnAuthStateChanged
   if (typeof window !== 'undefined') {
    (window as any).__mockCurrentUser = null;
    (window as any).__triggerMockAuthStateChange(null);
  }
};

// Store the callback to be triggered by sign-in/sign-out
if (typeof window !== 'undefined') {
    (window as any).__mockAuthCallback = null;
    (window as any).__triggerMockAuthStateChange = (user: MockUser | null) => {
        if ((window as any).__mockAuthCallback) {
            (window as any).__mockAuthCallback(user);
        }
    };
}

export const mockOnAuthStateChanged = (callback: (user: MockUser | null) => void): (() => void) => {
  console.log("Mock onAuthStateChanged listener attached");
  if (typeof window !== 'undefined') {
    (window as any).__mockAuthCallback = callback;
    // Simulate an initial state (e.g., no user logged in, or previously signed-in user)
    setTimeout(() => callback((window as any).__mockCurrentUser || null), 100);
  } else {
    // For server-side or initial non-browser context, assume no user
    setTimeout(() => callback(null), 100);
  }
  
  // Return an unsubscribe function
  return () => {
    console.log("Mock onAuthStateChanged listener detached");
    if (typeof window !== 'undefined') {
        (window as any).__mockAuthCallback = null;
    }
  };
};

export const mockUploadProfileImage = async (userId: string, file: File): Promise<string> => {
  console.log(`Mock uploadProfileImage called for user ${userId} with file:`, file.name);
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload delay
  // Simulate a successful upload and return a placeholder URL
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result as string); // Return the Data URL as a mock download URL
    };
    reader.readAsDataURL(file);
  });
};

// Placeholder for actual Firebase App initialization
// export const app = {}; // Replace with initializeApp(firebaseConfig)
// export const auth = {}; // Replace with getAuth(app)
// export const db = {}; // Replace with getFirestore(app)
// export const storage = {}; // Replace with getStorage(app)

