// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  setPersistence, 
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  deleteDoc
} from "firebase/firestore"; // Import Firestore functions

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSY1pWG0mOHEMkxFEkNpo_dqBFUC4SDCU",
  authDomain: "smartspend-ai-da2e6.firebaseapp.com",
  projectId: "smartspend-ai-da2e6",
  storageBucket: "smartspend-ai-da2e6.firebasestorage.app",
  messagingSenderId: "566963864297",
  appId: "1:566963864297:web:96ca0da1460e65591fa678",
  measurementId: "G-6P7FE4YN4Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
setPersistence(auth, browserLocalPersistence);

// Initialize Firestore
const db = getFirestore(app);

// Export the functions and services
export { 
  auth, 
  provider, 
  signInWithPopup, 
  signOut, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  db, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  deleteDoc
};