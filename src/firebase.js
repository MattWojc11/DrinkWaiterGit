// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYCIxhZeyWyM7MJH8DSi50FexbigO6Gg0",
  authDomain: "drinekdb.firebaseapp.com",
  projectId: "drinekdb",
  storageBucket: "drinekdb.appspot.com",
  messagingSenderId: "1046326910166",
  appId: "1:1046326910166:web:3bb13c06fa091f02d67d77",
  measurementId: "G-8R2EWKLPZQ"
};

// Inicjalizacja aplikacji Firebase
const app = initializeApp(firebaseConfig);

// Inicjalizacja Firestore
const db = getFirestore(app); // Upewnij się, że ta linia jest obecna

// Inicjalizacja Autoryzacji
const auth = getAuth(app);

// Eksportuj db i auth
export { db, auth };