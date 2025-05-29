
// TODO: Add your Firebase project configuration here
// See https://firebase.google.com/docs/web/setup#available-libraries

// Import the functions you need from the SDKs you need
// import { initializeApp, type FirebaseApp } from "firebase/app";
// import { 
//   getAuth, 
//   type Auth, 
//   type UserCredential, 
//   GoogleAuthProvider, // You'll need this for Google Sign-In
//   signInWithPopup     // And this
// } from "firebase/auth";
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

// Store the callback and current user state globally on window for mock purposes
if (typeof window !== 'undefined') {
  (window as any).__mockAuthCallback = (window as any).__mockAuthCallback || null;
  (window as any).__mockCurrentUser = (window as any).__mockCurrentUser || null;
  (window as any).__triggerMockAuthStateChange = (user: MockUser | null) => {
      (window as any).__mockCurrentUser = user; // Update global mock user state
      if ((window as any).__mockAuthCallback) {
          (window as any).__mockAuthCallback(user);
      }
  };
}


export const mockSignInWithEmailAndPassword = async (email: string, pass: string): Promise<MockUser | null> => {
  console.log("Mock signInWithEmailAndPassword called with:", email, pass);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  if (email === "test@example.com" && pass === "password") {
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
    if (typeof window !== 'undefined') {
        (window as any).__triggerMockAuthStateChange(mockUser);
    }
    return mockUser;
  }
  throw new Error("Invalid credentials (mock)");
};

export const mockSignInWithGoogle = async (): Promise<MockUser | null> => {
  console.log("Mock mockSignInWithGoogle called");
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  // Simulate successful Google sign-in
  const mockUser = {
    uid: "mock-google-user-uid",
    email: "googleuser@example.com",
    displayName: "Google User",
    emailVerified: true,
    isAnonymous: false,
    metadata: { creationTime: new Date().toISOString(), lastSignInTime: new Date().toISOString() },
    providerData: [{ providerId: "google.com", uid: "google-uid", displayName: "Google User", email: "googleuser@example.com", phoneNumber: null, photoURL: "https://placehold.co/100x100.png" }],
    providerId: "firebase", // This would typically be firebase for federated providers
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => "mock-google-id-token",
    getIdTokenResult: async () => ({ token: "mock-google-id-token", claims: {}, expirationTime: "", issuedAtTime: "", signInProvider: "google.com", signInSecondFactor: null }),
    reload: async () => {},
    toJSON: () => ({}),
    photoURL: "https://placehold.co/100x100.png",
    phoneNumber: null,
  } as MockUser;
   if (typeof window !== 'undefined') {
    (window as any).__triggerMockAuthStateChange(mockUser);
  }
  return mockUser;
  // When implementing actual Firebase:
  // const provider = new GoogleAuthProvider();
  // try {
  //   const result = await signInWithPopup(auth, provider); // Use your actual 'auth' instance
  //   return result.user;
  // } catch (error) {
  //   console.error("Error during Google sign-in:", error);
  //   throw error;
  // }
};

export const mockCreateUserWithEmailAndPassword = async (email: string, pass: string): Promise<MockUser | null> => {
  console.log("Mock createUserWithEmailAndPassword called with:", email, pass);
  await new Promise(resolve => setTimeout(resolve, 1000));
  const mockUser = {
    uid: `new-mock-user-${Date.now()}`,
    email: email,
    displayName: email.split('@')[0],
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
  // Don't trigger auth state change on creation for mock, usually requires sign-in after
  return mockUser;
};

export const mockSignOut = async (): Promise<void> => {
  console.log("Mock signOut called");
  await new Promise(resolve => setTimeout(resolve, 500));
   if (typeof window !== 'undefined') {
    (window as any).__triggerMockAuthStateChange(null);
  }
};

export const mockOnAuthStateChanged = (callback: (user: MockUser | null) => void): (() => void) => {
  console.log("Mock onAuthStateChanged listener attached");
  if (typeof window !== 'undefined') {
    (window as any).__mockAuthCallback = callback;
    // Simulate an initial state check
    setTimeout(() => {
      if ((window as any).__mockAuthCallback) { // Check if callback still exists
        (window as any).__mockAuthCallback((window as any).__mockCurrentUser || null);
      }
    }, 50); // Short delay to simulate async nature
  } else {
    setTimeout(() => callback(null), 50);
  }
  
  return () => {
    console.log("Mock onAuthStateChanged listener detached");
    if (typeof window !== 'undefined') {
        (window as any).__mockAuthCallback = null;
    }
  };
};

export const mockUploadProfileImage = async (userId: string, file: File): Promise<string> => {
  console.log(`Mock uploadProfileImage called for user ${userId} with file:`, file.name);
  await new Promise(resolve => setTimeout(resolve, 1500)); 
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result as string); 
    };
    reader.readAsDataURL(file);
  });
};

// Placeholder for actual Firebase App initialization
// export const app = {}; // Replace with initializeApp(firebaseConfig)
// export const auth = {}; // Replace with getAuth(app)
// export const db = {}; // Replace with getFirestore(app)
// export const storage = {}; // Replace with getStorage(app)
