// Load Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBioGgdFP3CaadF9iW0EXBvHwMG1__iKr4",
    authDomain: "dengue-454102.firebaseapp.com",
    projectId: "dengue-454102",
    storageBucket: "dengue-454102.appspot.com", // FIXED STORAGE BUCKET
    messagingSenderId: "989474939574",
    appId: "1:989474939574:web:e1035d734e329efc997c17"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage(); // Added Firebase Storage

// Sign in function
function signIn() {
    auth.signInWithPopup(provider).then(result => {
        console.log("Signed in as:", result.user.displayName);
        updateUI(result.user);
    }).catch(error => console.error("Sign-in error:", error));
}

// Sign out function
function signOutUser() {
    auth.signOut().then(() => {
        console.log("User signed out");
        updateUI(null);
    }).catch(error => console.error("Sign-out error:", error));
}

// Listen for auth state changes
auth.onAuthStateChanged(user => {
    updateUI(user);
});

// Update UI based on sign-in state
function updateUI(user) {
    const userInfo = document.getElementById("user-info");
    const signInBtn = document.getElementById("google-signin");
    const signOutBtn = document.getElementById("signout");

    if (user) {
        if (userInfo) userInfo.innerText = `Signed in as: ${user.displayName}`;
        if (signInBtn) signInBtn.style.display = "none";
        if (signOutBtn) signOutBtn.style.display = "block";
    } else {
        if (userInfo) userInfo.innerText = "Not signed in";
        if (signInBtn) signInBtn.style.display = "block";
        if (signOutBtn) signOutBtn.style.display = "none";
    }
}

// Expose functions globally
window.signIn = signIn;
window.signOutUser = signOutUser;
window.storage = storage; // Expose storage globally for uploads

