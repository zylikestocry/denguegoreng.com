// Ensure Firebase is initialized
if (!firebase.apps.length) {
    console.error("Firebase is not initialized. Check firebase-config.js.");
}

// Function to upload files
async function uploadFiles() {
    const beforeImage = document.getElementById("beforeImage").files[0];
    const afterImage = document.getElementById("afterImage").files[0];
    const uploadStatus = document.getElementById("uploadStatus");

    // Ensure both files are selected
    if (!beforeImage || !afterImage) {
        uploadStatus.innerHTML = "Please select both images.";
        return;
    }

    try {
        // Get the current user
        const user = firebase.auth().currentUser;
        if (!user) {
            uploadStatus.innerHTML = "You must be signed in to upload files.";
            return;
        }
        const userId = user.uid;

        // Reference storage path
        const storageRef = firebase.storage().ref();
        const beforeRef = storageRef.child(`user_uploads/${userId}/before.jpg`);
        const afterRef = storageRef.child(`user_uploads/${userId}/after.jpg`);

        // Upload images
        uploadStatus.innerHTML = "Uploading files...";

        await beforeRef.put(beforeImage);
        await afterRef.put(afterImage);

        // Get URLs
        const beforeURL = await beforeRef.getDownloadURL();
        const afterURL = await afterRef.getDownloadURL();

        uploadStatus.innerHTML = `✅ Upload successful!<br>Before Image: <a href="${beforeURL}" target="_blank">View</a><br>After Image: <a href="${afterURL}" target="_blank">View</a>`;

        console.log("Before Image URL:", beforeURL);
        console.log("After Image URL:", afterURL);
    } catch (error) {
        console.error("Upload failed:", error);
        uploadStatus.innerHTML = `❌ Upload failed: ${error.message}`;
    }
}

// Ensure authentication state persistence
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log("User signed in:", user.uid);
    } else {
        console.log("User not signed in.");
    }
});
