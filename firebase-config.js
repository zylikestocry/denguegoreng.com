// ✅ Load Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBioGgdFP3CaadF9iW0EXBvHwMG1__iKr4",
    authDomain: "dengue-454102.firebaseapp.com",
    projectId: "dengue-454102",
    storageBucket: "dengue-454102.appspot.com", // ✅ Fixed storage bucket name
    messagingSenderId: "989474939574",
    appId: "1:989474939574:web:e1035d734e329efc997c17"
};

// ✅ Initialize Firebase if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

// ✅ Listen for auth state changes (Ensures UI updates correctly)
auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById("user-info").innerText = `Signed in as: ${user.displayName}`;
        document.getElementById("google-signin").style.display = "none";
        document.getElementById("signout").style.display = "block";
    } else {
        document.getElementById("user-info").innerText = "Not signed in";
        document.getElementById("google-signin").style.display = "block";
        document.getElementById("signout").style.display = "none";
    }
});

// ✅ Sign in function
function signIn() {
    auth.signInWithPopup(provider)
        .then(result => console.log("Signed in:", result.user.displayName))
        .catch(error => console.error("Sign-in error:", error));
}

// ✅ Sign out function
function signOutUser() {
    auth.signOut()
        .then(() => console.log("User signed out"))
        .catch(error => console.error("Sign-out error:", error));
}

// ✅ Expose functions to HTML buttons
window.signIn = signIn;
window.signOutUser = signOutUser;
window.storage = storage;
