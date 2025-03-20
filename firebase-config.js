// ✅ Ensure Firebase initializes correctly
const firebaseConfig = {
    apiKey: "AIzaSyBioGgdFP3CaadF9iW0EXBvHwMG1__iKr4",
    authDomain: "dengue-454102.firebaseapp.com",
    projectId: "dengue-454102",
    storageBucket: "dengue-454102.appspot.com", // ✅ Fixed storage bucket name
    messagingSenderId: "989474939574",
    appId: "1:989474939574:web:e1035d734e329efc997c17"
};

// ✅ Only initialize Firebase if it hasn’t been initialized yet
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // ✅ Use the existing app if already initialized
}

// ✅ Assign Firebase services
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

// ✅ Ensure Firebase Auth state is correctly managed
auth.onAuthStateChanged(user => {
    if (document.getElementById("user-info")) {
        document.getElementById("user-info").innerText = user
            ? `Signed in as: ${user.displayName}`
            : "Not signed in";
    }
});

// ✅ Expose functions globally
window.signIn = function () {
    auth.signInWithPopup(provider)
        .then(result => console.log("Signed in:", result.user.displayName))
        .catch(error => console.error("Sign-in error:", error));
};

window.signOutUser = function () {
    auth.signOut()
        .then(() => console.log("User signed out"))
        .catch(error => console.error("Sign-out error:", error));
};

window.storage = storage;
