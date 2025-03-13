// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase} from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHNmeYG--FX9HB_akNQjBxPgVdls2zCzQ",
  authDomain: "fe24-js2-slutprojekt-ida-845ab.firebaseapp.com",
  databaseURL: "https://fe24-js2-slutprojekt-ida-845ab-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fe24-js2-slutprojekt-ida-845ab",
  storageBucket: "fe24-js2-slutprojekt-ida-845ab.firebasestorage.app",
  messagingSenderId: "639548114290",
  appId: "1:639548114290:web:05bc9791c459b5147089eb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

