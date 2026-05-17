// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAdStsgJSMkQ5HAIxq-GCvWmNepSta0Drg",
    authDomain: "portfolioweb-39452.firebaseapp.com",
    projectId: "portfolioweb-39452",
    storageBucket: "portfolioweb-39452.firebasestorage.app",
    messagingSenderId: "587237752006",
    appId: "1:587237752006:web:d56c18fd15b8888d532bc7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
console.log("Firebase başarıyla bağlandı!");