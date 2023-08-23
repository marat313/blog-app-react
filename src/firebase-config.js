// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDkNMLXTyMprlRzoxhB9r5_R4VHbKpMpo",
  authDomain: "my-blog-970fb.firebaseapp.com",
  projectId: "my-blog-970fb",
  storageBucket: "my-blog-970fb.appspot.com",
  messagingSenderId: "1046056408323",
  appId: "1:1046056408323:web:d240532aa382d61c148536",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);
