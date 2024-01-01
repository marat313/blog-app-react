// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
/*   apiKey: "AIzaSyBMHX65KlgHLpRQ1ZI8UHwhQLWyE5x7jI0",
  authDomain: "phenomen313.firebaseapp.com",
  projectId: "phenomen313",
  storageBucket: "phenomen313.appspot.com",
  messagingSenderId: "731227030891",
  appId: "1:731227030891:web:45b5fa6919cbd3585db82e" */
  apiKey: "AIzaSyD-GS6eTwy9GK3YqbnUPkWhITLUCgeR3zI",
  authDomain: "the-code313.firebaseapp.com",
  projectId: "the-code313",
  storageBucket: "the-code313.appspot.com",
  messagingSenderId: "177394147101",
  appId: "1:177394147101:web:986588ee6afbcbc703cbf4"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);
