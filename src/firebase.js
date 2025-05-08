import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, setLogLevel } from "firebase/firestore";

// Enable debug logging for Firestore
setLogLevel("debug");




const firebaseConfig = {
  apiKey: "AIzaSyCu0447Zh5eT22_nx80rprzD6HKMPYUMro",
  authDomain: "epic-ee0e2.firebaseapp.com",
  projectId: "epic-ee0e2",
  storageBucket: "epic-ee0e2.firebasestorage.app",
  messagingSenderId: "991949167336",
  appId: "1:991949167336:web:6af627577bcd3e8710875d",
  measurementId: "G-LGLWX85CV6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);