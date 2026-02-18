// Firebase initialization for UnBind
// REPLACE the config values below with your Firebase project config

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDqJWBgaCD0fGV-ylYKQk1MXuAkRKigU5o",
  authDomain: "unbind-reader-ff295.firebaseapp.com",
  projectId: "unbind-reader-ff295",
  storageBucket: "unbind-reader-ff295.firebasestorage.app",
  messagingSenderId: "507892162988",
  appId: "1:507892162988:web:a83b57d082cbb5b96dda09",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
