// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD13C9OOQnAC1R6TU5ng3zCxRrnl_Ajngw",
  authDomain: "yamatokishita-blog.firebaseapp.com",
  projectId: "yamatokishita-blog",
  storageBucket: "yamatokishita-blog.appspot.com",
  messagingSenderId: "189085699869",
  appId: "1:189085699869:web:612548f8fd6532e1971bf4",
  measurementId: "G-VXEVRJWC6P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, githubProvider, db };
