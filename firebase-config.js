// Load Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBioGgdFP3CaadF9iW0EXBvHwMG1__iKr4",
    authDomain: "dengue-454102.firebaseapp.com",
    projectId: "dengue-454102",
    storageBucket: "dengue-454102.appspot.com", // Corrected storage bucket format
    messagingSenderId: "989474939574",
    appId: "1:989474939574:web:e1035d734e329efc997c17"
};

// Initialize Firebase only if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Initialize Firebase Services
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

// Ensure the DOM is fully loaded before running any script
document.addEventListener("DOMContentLoaded", () => {
    const userInfo = document.getElementById("user-info");
    const signInBtn = document.getElementById("google-signin");
    const signOutBtn = document.getElementById("signout");

    function updateUI(user) {
        if (userInfo && signInBtn && signOutBtn) {
            if (user) {
                userInfo.innerText = `Signed in as: ${user.displayName}`;
                signInBtn.style.display = "none";
                signOutBtn.style.display = "block";
            } else {
                userInfo.innerText = "Not signed in";
                signInBtn.style.display = "block";
                signOutBtn.style.display = "none";
            }
        }
    }

    // Sign in function
    function signIn() {
        auth.signInWithPopup(provider)
            .then(result => {
                console.log("Signed in as:", result.user.displayName);
                updateUI(result.user);
            })
            .catch(error => console.error("Sign-in error:", error));
    }

    // Sign out function
    function signOutUser() {
        auth.signOut()
            .then(() => {
                console.log("User signed out");
                updateUI(null);
            })
            .catch(error => console.error("Sign-out error:", error));
    }

    // Listen for auth state changes
    auth.onAuthStateChanged(user => {
        updateUI(user);
    });

    // Expose functions globally
    window.signIn = signIn;
    window.signOutUser = signOutUser;
    window.storage = storage;
});
