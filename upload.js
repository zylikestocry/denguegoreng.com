document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ upload.js loaded");

    const beforeImageInput = document.getElementById("beforeImage");
    const afterImageInput = document.getElementById("afterImage");
    const uploadStatus = document.getElementById("uploadStatus");
    const submitButton = document.getElementById("submitBtn");

    if (!submitButton) {
        console.error("❌ Error: Submit button not found.");
        return;
    }

    if (!beforeImageInput || !afterImageInput) {
        console.error("❌ Error: Image input fields not found.");
        return;
    }

    // ✅ Track login state globally
    let currentUser = null;
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log("✅ User authenticated:", user.uid);
            currentUser = user; // Store user globally
        } else {
            console.warn("⚠️ User not logged in.");
            currentUser = null;
        }
    });

    function uploadFiles() {
        console.log("✅ uploadFiles() triggered");

        if (!beforeImageInput.files.length || !afterImageInput.files.length) {
            uploadStatus.innerText = "Please select both images.";
            console.warn("⚠️ No images selected.");
            return;
        }

        if (!firebase.apps.length) {
            console.error("❌ Firebase is not initialized.");
            uploadStatus.innerText = "Error: Firebase not loaded.";
            return;
        }

        if (!currentUser) {
            uploadStatus.innerText = "Please sign in first.";
            console.error("❌ User is not signed in.");
            return;
        }

        const userId = currentUser.uid;
        const beforeFile = beforeImageInput.files[0];
        const afterFile = afterImageInput.files[0];
        const timestamp = Date.now();

        console.log(`Uploading for user ${userId}...`);

        const beforeRef = firebase.storage().ref(`user_uploads/${userId}/before_${timestamp}.jpg`);
        const afterRef = firebase.storage().ref(`user_uploads/${userId}/after_${timestamp}.jpg`);

        Promise.all([
            beforeRef.put(beforeFile).then(snapshot => snapshot.ref.getDownloadURL()),
            afterRef.put(afterFile).then(snapshot => snapshot.ref.getDownloadURL())
        ]).then(([beforeUrl, afterUrl]) => {
            console.log("✅ Upload successful");
            console.log("Before Image URL:", beforeUrl);
            console.log("After Image URL:", afterUrl);

            uploadStatus.innerText = "Images uploaded successfully!";

            return firebase.firestore().collection("uploads").add({
                userId,
                beforeImage: beforeUrl,
                afterImage: afterUrl,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        }).then(() => {
            console.log("✅ Image URLs stored in Firestore.");
        }).catch(error => {
            console.error("❌ Upload failed:", error);
            uploadStatus.innerText = "Upload failed: " + error.message;
        });
    }

    submitButton.addEventListener("click", () => {
        if (currentUser) {
            console.log("✅ User is authenticated. Proceeding with upload...");
            uploadFiles();
        } else {
            console.error("❌ User not authenticated! Redirecting to login...");
            alert("Please sign in before uploading.");
            window.location.href = "login.html"; // Redirect to login page
        }
    });
});
