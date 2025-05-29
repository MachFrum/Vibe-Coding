
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  type Auth,
  type User,
  type UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged // Renamed to avoid conflict
} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, type FirebaseStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: "G-XXXXXXXXXX" // Optional
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);

console.log("Firebase initialized");

// Export the User type from firebase/auth
export type { User };

// Authentication functions
const doSignInWithEmailAndPassword = async (email: string, pass: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, pass);
};

const doSignInWithGoogle = async (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  // You might want to add custom parameters or scopes here
  // provider.addScope('profile');
  // provider.addScope('email');
  return signInWithPopup(auth, provider);
};

const doCreateUserWithEmailAndPassword = async (email: string, pass: string): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, pass);
};

const doSignOut = async (): Promise<void> => {
  return signOut(auth);
};

const onAuthStateChanged = (callback: (user: User | null) => void): (() => void) => {
  return firebaseOnAuthStateChanged(auth, callback);
};

// Storage functions
const uploadProfileImage = async (userId: string, file: File): Promise<string> => {
  const fileRef = storageRef(storage, `users/${userId}/profile.jpg`);
  await uploadBytes(fileRef, file, {
    customMetadata: {
      uploadedBy: userId,
      entityType: "profile",
      timestamp: new Date().toISOString(),
    }
  });
  const downloadURL = await getDownloadURL(fileRef);
  // In a real app, you'd likely trigger a Cloud Function here to write an activity log
  // and update the user's Firestore document with this URL.
  console.log("File uploaded, URL:", downloadURL);
  return downloadURL;
};


// Re-exporting auth functions and instances with clearer names if needed,
// or components can import them directly.
export {
  app,
  auth,
  db,
  storage,
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
  doCreateUserWithEmailAndPassword,
  doSignOut,
  onAuthStateChanged,
  uploadProfileImage,
};

// The mock functions below are no longer needed and can be removed.
// We keep them here for reference during the transition if any part is missed,
// but ideally, they should be deleted once the real functions are confirmed working.

// export interface MockUser extends User {}

// if (typeof window !== 'undefined') {
//   (window as any).__mockAuthCallback = (window as any).__mockAuthCallback || null;
//   (window as any).__mockCurrentUser = (window as any).__mockCurrentUser || null;
//   (window as any).__triggerMockAuthStateChange = (user: MockUser | null) => {
//       (window as any).__mockCurrentUser = user;
//       if ((window as any).__mockAuthCallback) {
//           (window as any).__mockAuthCallback(user);
//       }
//   };
// }

// export const mockSignInWithEmailAndPassword = ... (old mock)
// export const mockSignInWithGoogle = ... (old mock)
// export const mockCreateUserWithEmailAndPassword = ... (old mock)
// export const mockSignOut = ... (old mock)
// export const mockOnAuthStateChanged = ... (old mock)
// export const mockUploadProfileImage = ... (old mock)
