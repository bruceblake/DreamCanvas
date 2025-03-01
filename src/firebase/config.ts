import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7Xk9ajpg7njnPswealXsvAEajYMUt6VM",
  authDomain: "dreamcanvas-d52d4.firebaseapp.com",
  projectId: "dreamcanvas-d52d4",
  storageBucket: "dreamcanvas-d52d4.firebasestorage.app",
  messagingSenderId: "805720012124",
  appId: "1:805720012124:web:b9810cbce205de86327d99",
  measurementId: "G-1DT8MN1SG3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };