// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithRedirect, 
    getRedirectResult, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBioGgdFP3CaadF9iW0EXBvHwMG1__iKr4",
    authDomain: "dengue-454102.firebaseapp.com",
    projectId: "dengue-454102",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "989474939574",
    appId: "1:989474939574:web:e1035d734e329efc997c17"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

// Sign in function (Redirect, NOT popup)
window.signIn = function () {
    signInWithRedirect(auth, provider);
};

// Handle redirect result
getRedirectResult(auth).then((result) => {
    if (result?.user) {
        updateUserUI(result.user);
    }
}).catch((error) => {
    console.error("Sign-in error:", error);
});

// Track auth state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        updateUserUI(user);
    } else {
        document.getElementById("user-info").innerText = "Not signed in";
    }
});

// Sign out function
window.signOutUser = function () {
    signOut(auth).then(() => {
        document.getElementById("user-info").innerText = "Signed out";
    });
};

// Function to update UI after sign-in
function updateUserUI(user) {
    document.getElementById("user-info").innerText = `Signed in as: ${user.displayName}`;
}

