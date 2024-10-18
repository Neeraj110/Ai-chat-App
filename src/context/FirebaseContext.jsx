/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwA4YK1b4wdDij7jdWd2FW7ICr6yWDkGM",
  authDomain: "ai-chatbot-ec559.firebaseapp.com",
  databaseURL:
    "https://ai-chatbot-ec559-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ai-chatbot-ec559",
  storageBucket: "ai-chatbot-ec559.appspot.com",
  messagingSenderId: "1080539214866",
  appId: "1:1080539214866:web:2abe45d0a0accd5889d4cb",
};

export const FirebaseContext = createContext(null);

export const useFirebase = () => useContext(FirebaseContext);

// Initialize Firebase App and Auth
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

// Firebase Provider Component
const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const signUpWithEmail = (email, password) =>
    createUserWithEmailAndPassword(firebaseAuth, email, password);

  const signInWithEmail = (email, password) =>
    signInWithEmailAndPassword(firebaseAuth, email, password);

  const signInWithGoogle = () =>
    signInWithRedirect(firebaseAuth, googleProvider);

  const logout = () => signOut(firebaseAuth);

  return (
    <FirebaseContext.Provider
      value={{
        user,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
