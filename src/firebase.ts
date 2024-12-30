// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { ref, getDatabase } from 'firebase/database'
import { getAuth } from "firebase/auth";


// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmbr9pSh0nt-9pkpx0hDPfb6EyOUoWUXo",
  authDomain: "unischool-knowledge-members.firebaseapp.com",
  projectId: "unischool-knowledge-members",
  storageBucket: "unischool-knowledge-members.firebasestorage.app",
  messagingSenderId: "272314591697",
  appId: "1:272314591697:web:e9efede1bb8d8b8c1158f0",
  measurementId: "G-FH8NDRK4T7",
  // Add the correct database URL
  databaseURL: "https://unischool-knowledge-members-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const database = getDatabase(app);
