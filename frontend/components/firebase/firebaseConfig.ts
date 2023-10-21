// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1a_3MncCrRVMc7uYxEXZllNKruaq9ggI",
  authDomain: "onboardr-6d6bb.firebaseapp.com",
  projectId: "onboardr-6d6bb",
  storageBucket: "onboardr-6d6bb.appspot.com",
  messagingSenderId: "930868166185",
  appId: "1:930868166185:web:bb0c6e9a0ec489f2f6e638"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);