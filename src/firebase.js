import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCD6B91IPFlJAsdcf8-JFA5KixMg_BWRYw",
  authDomain: "task-manager-f29ba.firebaseapp.com",
  projectId: "task-manager-f29ba",
  storageBucket: "task-manager-f29ba.firebasestorage.app",
  messagingSenderId: "483268019138",
  appId: "1:483268019138:web:85452238fede55bc8f8c5b",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider };
