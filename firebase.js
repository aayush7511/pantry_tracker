// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Firestore } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcQR8j8MC-wwC9U19_qLFkwZrcZd-0mcY",
  authDomain: "pantry-app-26c03.firebaseapp.com",
  projectId: "pantry-app-26c03",
  storageBucket: "pantry-app-26c03.appspot.com",
  messagingSenderId: "957330302905",
  appId: "1:957330302905:web:fc9240490516cabf043868",
  measurementId: "G-8NWLHZGJ8Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export{
    app,
    firestore
}