
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
  onAuthStateChanged as firebaseOnAuthStateChanged, // Renamed to avoid conflict
  updateProfile
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
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // Optional
};

// --- DEBUGGING LOG ---
// Check your browser console to see if these values are being loaded correctly.
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase Config Loaded by App:', firebaseConfig);
}
if (!firebaseConfig.apiKey) {
  console.error("Firebase API Key is missing. Check your .env.local file and ensure the Next.js server was restarted.");
}
// --- END DEBUGGING LOG ---

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (!getApps().length) {
  if (!firebaseConfig.apiKey) {
    // Error is logged above.
    // Depending on how critical Firebase is at this point, you might throw an error
    // or allow the app to continue, knowing Firebase features will fail.
  }
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);

// Export the User type from firebase/auth
export type { User };

// Authentication functions
const doSignInWithEmailAndPassword = async (email: string, pass: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, pass);
};

const doSignInWithGoogle = async (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

const doCreateUserWithEmailAndPassword = async (email: string, pass: string): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, pass);
};

const doSignOut = async (): Promise<void> => {
  return signOut(auth);
};

const onAuthStateChanged = (callback: (user: User | null) => void): (() => void) => {
  return firebaseOnAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

// Storage functions
const uploadProfileImage = async (userId: string, file: File): Promise<string> => {
  const fileRef = storageRef(storage, `users/${userId}/profile-${Date.now()}-${file.name}`); // Added timestamp and original name for uniqueness
  await uploadBytes(fileRef, file, {
    customMetadata: {
      uploadedBy: userId,
      entityType: "profile",
      timestamp: new Date().toISOString(),
    }
  });
  const downloadURL = await getDownloadURL(fileRef);
  
  // Update the user's profile in Firebase Auth with the new photoURL
  if (auth.currentUser) {
    try {
      await updateProfile(auth.currentUser, { photoURL: downloadURL });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error updating Firebase Auth user profile photoURL:", error);
      }
      // Error updating Firebase Auth user profile photoURL
      // This might be handled by a more specific error message in the UI if critical
    }
  }
  
  // In a real app, you'd likely trigger a Cloud Function here to write an activity log
  // and update the user's Firestore document with this URL.
  return downloadURL;
};


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
  updateProfile // Export updateProfile if needed elsewhere, though often used internally here
};
