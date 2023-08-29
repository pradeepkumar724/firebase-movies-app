import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAqz9_6DjJZlO71hYrOQh4kiSHeiAiyW_U",
  authDomain: "firestore-e533d.firebaseapp.com",
  projectId: "firestore-e533d",
  storageBucket: "firestore-e533d.appspot.com",
  messagingSenderId: "856648402581",
  appId: "1:856648402581:web:1a1e644a8d5857a344fd9c",
  measurementId: "G-NEQTYXLMK4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
// IMPLEMENT FIRESTORE

export const db = getFirestore(app);
