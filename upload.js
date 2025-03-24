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
    const folderPath = `user_uploads/${userId}/${timestamp}/`;

    console.log(`📤 Uploading files for user ${userId} in folder ${folderPath}...`);

    const beforeRef = firebase.storage().ref(`${folderPath}before.jpg`);
    const afterRef = firebase.storage().ref(`${folderPath}after.jpg`);

    try {
        const beforeSnapshot = await beforeRef.put(beforeFile);
        const afterSnapshot = await afterRef.put(afterFile);

        const beforeUrl = await beforeSnapshot.ref.getDownloadURL();
        const afterUrl = await afterSnapshot.ref.getDownloadURL();

        console.log("✅ Upload successful");
        console.log("Before Image URL:", beforeUrl);
        console.log("After Image URL:", afterUrl);

        uploadStatus.innerText = "Images uploaded successfully! Submitting to Google Form...";

        submitToGoogleForm(beforeUrl, afterUrl);
    } catch (error) {
        console.error("❌ Upload failed:", error);
        uploadStatus.innerText = "Upload failed: " + error.message;
    }
};

function submitToGoogleForm(beforeUrl, afterUrl) {
    const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSe_0etZbsqjaFq7ogUFK6NZGUfZ8VkQw6s5uxUhT7TYE-PmxA/formResponse";
    const formData = new FormData();

    formData.append("entry.1234567890", beforeUrl); // Replace with actual Google Form entry ID
    formData.append("entry.0987654321", afterUrl); // Replace with actual Google Form entry ID

    fetch(formUrl, {
        method: "POST",
        body: formData,
        mode: "no-cors"
    }).then(() => {
        console.log("✅ Form submitted successfully");
        alert("Images uploaded and submitted to Google Form!");
    }).catch(error => {
        console.error("❌ Form submission failed:", error);
    });
}

