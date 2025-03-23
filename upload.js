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

    submitButton.addEventListener("click", async () => {
        console.log("✅ Submit button clicked! Checking authentication...");

        const user = firebase.auth().currentUser;
        if (!user) {
            console.error("❌ User not authenticated! Redirecting to login...");
            alert("Please sign in before uploading.");
            window.location.href = "login.html";
            return;
        }

        console.log("✅ User is authenticated:", user.uid);
        await uploadFiles(user);
    });

    async function uploadFiles(user) {
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

        const userId = user.uid;
        const beforeFile = beforeImageInput.files[0];
        const afterFile = afterImageInput.files[0];
        const timestamp = Date.now();

        console.log(`📤 Uploading files for user ${userId}...`);

        const beforeRef = firebase.storage().ref(`user_uploads/${userId}/before_${timestamp}.jpg`);
        const afterRef = firebase.storage().ref(`user_uploads/${userId}/after_${timestamp}.jpg`);

        try {
            const beforeSnapshot = await beforeRef.put(beforeFile);
            const afterSnapshot = await afterRef.put(afterFile);

            const beforeUrl = await beforeSnapshot.ref.getDownloadURL();
            const afterUrl = await afterSnapshot.ref.getDownloadURL();

            console.log("✅ Upload successful");
            console.log("Before Image URL:", beforeUrl);
            console.log("After Image URL:", afterUrl);

            uploadStatus.innerText = "Images uploaded successfully!";

            await firebase.firestore().collection("uploads").add({
                userId,
                beforeImage: beforeUrl,
                afterImage: afterUrl,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log("✅ Image URLs stored in Firestore.");
        } catch (error) {
            console.error("❌ Upload failed:", error);
            uploadStatus.innerText = "Upload failed: " + error.message;
        }
    }
});
