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

        const beforeFile = await compressImage(beforeImageInput.files[0]);
        const afterFile = await compressImage(afterImageInput.files[0]);
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
            await fetch("https://us-central1-dengue-454102.cloudfunctions.net/analyzeImage", {
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
            showPopup(); // Show pop-up after successful upload
        } catch (error) {
            console.error("❌ Upload failed:", error);
            uploadStatus.innerText = "Upload failed: " + error.message;
        }
    });
});

// Image compression function
async function compressImage(file) {
    const options = {
        maxSizeMB: 1, // Max size 1MB
        maxWidthOrHeight: 1024, // Resize image
        useWebWorker: true
    };

    try {
        const compressedFile = await imageCompression(file, options);
        console.log("✅ Image compressed:", compressedFile);
        return compressedFile;
    } catch (error) {
        console.error("❌ Image compression failed:", error);
        return file; // Return original file if compression fails
    }
}

// Pop-up functions
function showPopup() {
    const popup = document.createElement("div");
    popup.id = "customPopup";
    popup.innerHTML = `
        <div class="popup-content">
            <p>✅ Images uploaded successfully! Verification in progress...</p>
            <button onclick="closePopup()">OK</button>
        </div>
    `;
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.backgroundColor = "#add8e6";
    popup.style.padding = "20px";
    popup.style.borderRadius = "15px";
    popup.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
    popup.style.fontFamily = "Comic Sans MS, cursive, sans-serif";
    popup.style.textAlign = "center";
    popup.style.zIndex = "1000";

    const button = popup.querySelector("button");
    button.style.backgroundColor = "white";
    button.style.border = "none";
    button.style.padding = "10px 20px";
    button.style.borderRadius = "10px";
    button.style.cursor = "pointer";
    button.style.fontSize = "16px";
    button.style.marginTop = "10px";

    button.addEventListener("mouseover", () => {
        button.style.backgroundColor = "#f0f0f0";
    });
    button.addEventListener("mouseout", () => {
        button.style.backgroundColor = "white";
    });

    document.body.appendChild(popup);
}

function closePopup() {
    const popup = document.getElementById("customPopup");
    if (popup) {
        popup.remove();
    }
}
