// Check if Firebase is available
if (typeof firebase === 'undefined') {
  console.error('Firebase SDK is not loaded. Make sure you have included the Firebase scripts in your HTML.');
} else {
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

  // Initialize Firebase
  try {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
    
    // Initialize Firebase services
    const db = firebase.firestore();
    const storage = firebase.storage();
    const analytics = firebase.analytics();
    
    // Make Firebase services available globally
    window.db = db;
    window.storage = storage;
    window.analytics = analytics;
    
    // Call the initialization function if it exists
    if (typeof loadLogosFromFirebase === 'function') {
      loadLogosFromFirebase();
    } else {
      console.warn('loadLogosFromFirebase function not found. Make sure script.js is loaded correctly.');
    }

    // Firebase Storage Security Rules
    const storageRules = `
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /{document=**} {
          allow read, write: if true;  // This allows anyone to read/write - for production, you should restrict this
        }
      }
    }
    `;
    console.log('Firebase Storage Rules:', storageRules);
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
}