// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAO6dyONklESriV0JolOmafx60I-79w6UA",
  authDomain: "logoplainjane.firebaseapp.com",
  projectId: "logoplainjane",
  storageBucket: "logoplainjane.firebasestorage.app",
  messagingSenderId: "53515738347",
  appId: "1:53515738347:web:886b5a7efd8141f37172ae",
  measurementId: "G-ENK134X763"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, db, storage };