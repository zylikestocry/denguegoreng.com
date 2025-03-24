// upload.js - Google Forms Integrated Upload System

document.addEventListener("DOMContentLoaded", async () => {
    console.log("✅ upload.js loaded");

    const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSe_0etZbsqjaFq7ogUFK6NZGUfZ8VkQw6s5uxUhT7TYE-PmxA/formResponse";
    const beforeImageInput = document.getElementById("beforeImage");
    const afterImageInput = document.getElementById("afterImage");
    const submitButton = document.getElementById("submitBtn");
    const uploadStatus = document.getElementById("uploadStatus");

    if (!submitButton) {
        console.error("❌ Submit button not found.");
        return;
    }

    submitButton.addEventListener("click", async () => {
        console.log("✅ Submit button clicked! Checking authentication...");

        const user = firebase.auth().currentUser;
        if (!user) {
            alert("Please sign in before uploading.");
            window.location.href = "login.html";
            return;
        }

        console.log("✅ User is authenticated:", user.uid);

        if (!beforeImageInput.files.length || !afterImageInput.files.length) {
            uploadStatus.innerText = "Please select both images.";
            return;
        }

        const beforeFile = beforeImageInput.files[0];
        const afterFile = afterImageInput.files[0];
        const timestamp = Date.now();
        const folderPath = `user_uploads/${user.uid}/${timestamp}/`;

        try {
            // Upload images to Firebase Storage
            const beforeRef = firebase.storage().ref(`${folderPath}before.jpg`);
            const afterRef = firebase.storage().ref(`${folderPath}after.jpg`);
            const beforeSnapshot = await beforeRef.put(beforeFile);
            const afterSnapshot = await afterRef.put(afterFile);

            const beforeUrl = await beforeSnapshot.ref.getDownloadURL();
            const afterUrl = await afterSnapshot.ref.getDownloadURL();

            console.log("✅ Images uploaded to Firebase.");

            // Send URLs to Google Form
            const formData = new FormData();
            formData.append("entry.123456789", beforeUrl); // 1FAIpQLSe_0etZbsqjaFq7ogUFK6NZGUfZ8VkQw6s5uxUhT7TYE-PmxA

            formData.append("entry.987654321", afterUrl); // 1FAIpQLSe_0etZbsqjaFq7ogUFK6NZGUfZ8VkQw6s5uxUhT7TYE-PmxA


            await fetch(formUrl, { method: "POST", body: formData });

            console.log("✅ Data sent to Google Form.");
            uploadStatus.innerText = "Images uploaded and sent for verification!";

            // Store in Firestore for leaderboard tracking
            await firebase.firestore().collection("uploads").add({
                userId: user.uid,
                beforeImage: beforeUrl,
                afterImage: afterUrl,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                verified: false // Will be updated after Google Vision AI verification
            });

            console.log("✅ Upload logged in Firestore.");
        } catch (error) {
            console.error("❌ Upload failed:", error);
            uploadStatus.innerText = "Upload failed: " + error.message;
        }
    });
});

