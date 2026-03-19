import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCoAK616TTCfPTMHhEH1knP_ehYSDX-OKs",
  authDomain: "mastered-563cf.firebaseapp.com",
  projectId: "mastered-563cf",
  storageBucket: "mastered-563cf.firebasestorage.app",
  messagingSenderId: "340640652828",
  appId: "1:340640652828:web:dd0a8b7cca6decdec009d9",
  measurementId: "G-0S2KLRN5PY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

await setPersistence(auth, browserLocalPersistence);

export {
  auth,
  createUserWithEmailAndPassword,
  googleProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
};
