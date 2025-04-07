// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAO6dyONklESriV0JolOmafx60I-79w6UA",
  authDomain: "logoplainjane.firebaseapp.com",
  projectId: "logoplainjane",
  storageBucket: "logoplainjane.appspot.com",
  messagingSenderId: "53515738347",
  appId: "1:53515738347:web:886b5a7efd8141f37172ae",
  measurementId: "G-ENK134X763"
};

// Initialize Firebase when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
});
