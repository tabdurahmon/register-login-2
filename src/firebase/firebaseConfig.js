import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC54RdBkRXtVkjYEMmSqFeducuM4qY2dU0",
  authDomain: "my-store-8e465.firebaseapp.com",
  projectId: "my-store-8e465",
  storageBucket: "my-store-8e465.appspot.com",
  messagingSenderId: "745312645287",
  appId: "1:745312645287:web:a38edec9a926f364b82b82",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//auth
export const auth = getAuth(app);

//data base
export const db = getFirestore(app);
