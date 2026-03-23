import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBlsbKkqLd0KdzGSRbFOQqJIVcVuaXLfq8",
  authDomain: "cigar-lounge-3891c.firebaseapp.com",
  projectId: "cigar-lounge-3891c",
  storageBucket: "cigar-lounge-3891c.firebasestorage.app",
  messagingSenderId: "11736316620",
  appId: "1:11736316620:web:ca21ec44ae31ea649be069",
  measurementId: "G-DSHL54CRHS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;
