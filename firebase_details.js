// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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