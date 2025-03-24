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
        uploadFiles(user);
    });
});

// 🔥 Ensure Both Images Are Uploaded in One Transaction
window.uploadFiles = async function(user) {
    console.log("🔥 uploadFiles() called with user:", user);

    const beforeImageInput = document.getElementById("beforeImage");
    const afterImageInput = document.getElementById("afterImage");
    const uploadStatus = document.getElementById("uploadStatus");

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

    console.log(`📤 Uploading both images for user ${userId}...`);

    const storage = firebase.storage();
    const beforeRef = storage.ref(`user_uploads/${userId}/before_${timestamp}.jpg`);
    const afterRef = storage.ref(`user_uploads/${userId}/after_${timestamp}.jpg`);

    try {
        // 🌟 Upload both files simultaneously
        const [beforeSnapshot, afterSnapshot] = await Promise.all([
            beforeRef.put(beforeFile),
            afterRef.put(afterFile)
        ]);

        // ✅ Get download URLs after both images are uploaded
        const beforeUrl = await beforeSnapshot.ref.getDownloadURL();
        const afterUrl = await afterSnapshot.ref.getDownloadURL();

        console.log("✅ Both images uploaded successfully");
        console.log("Before Image URL:", beforeUrl);
        console.log("After Image URL:", afterUrl);

        uploadStatus.innerText = "Images uploaded successfully!";

        // 🌟 Store paired image URLs in Firestore
        await firebase.firestore().collection("uploads").add({
            userId,
            beforeImage: beforeUrl,
            afterImage: afterUrl,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        console.log("✅ Both images stored in Firestore.");
    } catch (error) {
        console.error("❌ Upload failed:", error);
        uploadStatus.innerText = "Upload failed: " + error.message;
    }
};
