import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCKsqAPBEmCnHUDMPSlIgA6RmlwCWwy1fs",
    authDomain: "biogym-dcc9b.firebaseapp.com",
    projectId: "biogym-dcc9b",
    storageBucket: "biogym-dcc9b.appspot.com",
    messagingSenderId: "1030180144290",
    appId: "1:1030180144290:web:8f292066b0a82d33f603fb",
    measurementId: "G-Y9Q23CQNGM"  
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);