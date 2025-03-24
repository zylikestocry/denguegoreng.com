// upload.js - Firebase Storage & Google Vision AI Integration

document.addEventListener("DOMContentLoaded", async () => {
    console.log("✅ upload.js loaded");

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

            // Store in Firestore for verification
            const docRef = await firebase.firestore().collection("uploads").add({
                userId: user.uid,
                beforeImage: beforeUrl,
                afterImage: afterUrl,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                verified: false // Will be updated after Google Vision AI & Diffchecker
            });

            console.log("✅ Upload logged in Firestore, awaiting verification...");

            // Send images to Google Vision AI & Diffchecker
            await fetch("https://your-cloud-function-url/verify-images", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.uid,
                    beforeUrl: beforeUrl,
                    afterUrl: afterUrl,
                    uploadId: docRef.id
                })
            });

            uploadStatus.innerText = "Images uploaded! Verification in progress...";
        } catch (error) {
            console.error("❌ Upload failed:", error);
            uploadStatus.innerText = "Upload failed: " + error.message;
        }
    });
});

