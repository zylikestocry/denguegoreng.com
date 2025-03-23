document.addEventListener("DOMContentLoaded", () => {
    const beforeImageInput = document.getElementById("beforeImage");
    const afterImageInput = document.getElementById("afterImage");
    const uploadStatus = document.getElementById("uploadStatus");
    const submitButton = document.getElementById("submitButton");

    // Ensure the button exists before adding an event listener
    if (!submitButton) {
        console.error("Error: Submit button not found.");
        return;
    }

    function uploadFiles() {
        if (!beforeImageInput.files.length || !afterImageInput.files.length) {
            uploadStatus.innerText = "Please select both images.";
            return;
        }

        // Ensure Firebase auth is initialized
        const user = firebase.auth().currentUser;
        if (!user) {
            uploadStatus.innerText = "Please sign in first.";
            console.error("User not authenticated.");
            return;
        }

        const userId = user.uid;
        const beforeFile = beforeImageInput.files[0];
        const afterFile = afterImageInput.files[0];

        const timestamp = Date.now();
        const beforeRef = firebase.storage().ref(`user_uploads/${userId}/before_${timestamp}.jpg`);
        const afterRef = firebase.storage().ref(`user_uploads/${userId}/after_${timestamp}.jpg`);

        Promise.all([
            beforeRef.put(beforeFile).then(snapshot => snapshot.ref.getDownloadURL()),
            afterRef.put(afterFile).then(snapshot => snapshot.ref.getDownloadURL())
        ]).then(([beforeUrl, afterUrl]) => {
            console.log("Before Image URL:", beforeUrl);
            console.log("After Image URL:", afterUrl);

            uploadStatus.innerText = "Images uploaded successfully!";

            // Optionally, store the URLs in Firestore for tracking
            return firebase.firestore().collection("uploads").add({
                userId: userId,
                beforeImage: beforeUrl,
                afterImage: afterUrl,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        }).then(() => {
            console.log("Image URLs stored in Firestore.");
        }).catch(error => {
            console.error("Upload failed:", error);
            uploadStatus.innerText = "Upload failed: " + error.message;
        });
    }

    // Wait for Firebase Auth to be ready before allowing uploads
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            submitButton.addEventListener("click", uploadFiles);
        } else {
            console.warn("User not signed in. Upload button will not work.");
        }
    });
});
