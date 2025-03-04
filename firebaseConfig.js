import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"; 

const firebaseConfig = {
    apiKey: "AIzaSyD9cJFhNU2HeHxA5TzBccG59co1MJfqIMI",
    authDomain: "ikarus-3d-9f3c9.firebaseapp.com",
    projectId: "ikarus-3d-9f3c9",
    storageBucket: "ikarus-3d-9f3c9.firebasestorage.app",
    messagingSenderId: "392626052388",
    appId: "1:392626052388:web:a128e39558ed509aaae7b1",
    measurementId: "G-LPMNKK9Q6S"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
