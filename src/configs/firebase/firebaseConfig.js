// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "bhep-iot.firebaseapp.com",
  databaseURL: "https://bhep-iot-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bhep-iot",
  storageBucket: "bhep-iot.appspot.com",
  messagingSenderId: "46057334140",
  appId: "1:46057334140:web:0005a64d92084ecae430f9",
  measurementId: "G-FY45GCZ5GH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Realtime Database
const database = getDatabase(app);
// Firestore Database
const db = getFirestore(app);
export { database, db }