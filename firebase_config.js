// Import Firebase modules (using the Firebase 9+ modular SDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, increment } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBrlgCiT3cbERNCOaZFT_UjgSVi81y_wKU",
    authDomain: "arcanex-the-roleplaying-game.firebaseapp.com",
    projectId: "arcanex-the-roleplaying-game",
    storageBucket: "arcanex-the-roleplaying-game.appspot.com",
    messagingSenderId: "212898746712",
    appId: "1:212898746712:web:f1f448418c5b79fb70952d",
    measurementId: "G-N30B0RRGXL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to check authentication state
export function checkAuthState(callback) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            callback(user);
        } else {
            // Handle not logged in (e.g., redirect to login)
            window.location.href = "/login.html";
        }
    });
}

// Function to create or fetch user data in Firestore
export function getUserData(uid, callback) {
    const userRef = doc(db, "users", uid);
    getDoc(userRef).then((docSnap) => {
        if (!docSnap.exists()) {
            // Create user document if it doesn't exist
            setDoc(userRef, {
                userType: "free",
                characterCount: 0,
                gamesCount: 0,
                purchases: [],
                storageUsed: 0
            }).then(() => {
                callback(null, {
                    userType: "free",
                    characterCount: 0,
                    gamesCount: 0
                });
            });
        } else {
            callback(null, docSnap.data());
        }
    }).catch((error) => {
        callback(error, null);
    });
}

// Example functions to update user data
export function updateUserCharacterCount(uid) {
    const userRef = doc(db, "users", uid);
    updateDoc(userRef, {
        characterCount: increment(1)
    }).catch((error) => {
        console.error("Error updating character count: ", error);
    });
}

export function addUserPurchase(uid, purchaseId) {
    const userRef = doc(db, "users", uid);
    updateDoc(userRef, {
        purchases: arrayUnion(purchaseId)
    }).catch((error) => {
        console.error("Error adding purchase: ", error);
    });
}
