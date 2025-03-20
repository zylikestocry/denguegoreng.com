// Import Firebase SDK
if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyBioGgdFP3CaadF9iW0EXBvHwMG1__iKr4",
        authDomain: "dengue-454102.firebaseapp.com",
        projectId: "dengue-454102",
        storageBucket: "dengue-454102.appspot.com", // ✅ Fixed the storage bucket
        messagingSenderId: "989474939574",
        appId: "1:989474939574:web:e1035d734e329efc997c17"
    });
} else {
    firebase.app();
}

// Assign Firebase services
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

window.auth = auth;
window.provider = provider;
window.storage = storage;

        .catch(error => console.error("Sign-out error:", error));
};

window.storage = storage;
