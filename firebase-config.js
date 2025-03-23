// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBioGgdFP3CaadF9iW0EXBvHwMG1__iKr4",
    authDomain: "dengue-454102.firebaseapp.com",
    projectId: "dengue-454102",
    storageBucket: "dengue-454102.appspot.com",
    messagingSenderId: "989474939574",
    appId: "1:989474939574:web:e1035d734e329efc997c17"
};

// ✅ Ensure Firebase is initialized once
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// ✅ Make Firebase services globally available
window.auth = firebase.auth();
window.storage = firebase.storage();
window.db = firebase.firestore();
