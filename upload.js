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

        try {
            // Compress images before upload
            const beforeFile = await compressImage(beforeImageInput.files[0]);
            const afterFile = await compressImage(afterImageInput.files[0]);

            const timestamp = Date.now();
            const folderPath = `user_uploads/${user.uid}/${timestamp}/`;

            // Upload images to Firebase Storage
            const beforeUrl = await uploadToStorage(`${folderPath}before.jpg`, beforeFile);
            const afterUrl = await uploadToStorage(`${folderPath}after.jpg`, afterFile);

            console.log("✅ Images uploaded to Firebase.");

            // Store in Firestore with retry mechanism
            const docRef = await retryFirestoreWrite({
                userId: user.uid,
                beforeImage: beforeUrl,
                afterImage: afterUrl,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                verified: false // Pending verification
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

// ✅ Function to compress images before upload (max 1MB, 1024px)
async function compressImage(file) {
    const options = {
        maxSizeMB: 1,  // Compress to max 1MB
        maxWidthOrHeight: 1024, // Resize to 1024px max
        useWebWorker: true
    };
    return await imageCompression(file, options);
}

// ✅ Function to upload image to Firebase Storage
async function uploadToStorage(filePath, file) {
    const fileRef = firebase.storage().ref(filePath);
    await fileRef.put(file);
    return await fileRef.getDownloadURL();
}

// ✅ Firestore write with retries (prevents rate-limit issues)
async function retryFirestoreWrite(data, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await firebase.firestore().collection("uploads").add(data);
        } catch (error) {
            console.error(`Retry ${i + 1}: Firestore write failed`, error);
            await new Promise(res => setTimeout(res, 1000)); // Wait 1 sec before retrying
        }
    }
    throw new Error("Firestore write failed after 3 retries.");
}

// ✅ Pop-up functions
function showPopup() {
    const popup = document.createElement("div");
    popup.id = "customPopup";
    popup.innerHTML = `
        <div class="popup-content">
            <p>✅ Images uploaded successfully! Verification in progress...</p>
            <button onclick="closePopup()">OK</button>
        </div>
    `;
    Object.assign(popup.style, {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#add8e6",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        fontFamily: "Comic Sans MS, cursive, sans-serif",
        textAlign: "center",
        zIndex: "1000"
    });

    const button = popup.querySelector("button");
    Object.assign(button.style, {
        backgroundColor: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "16px",
        marginTop: "10px"
    });

    button.addEventListener("mouseover", () => button.style.backgroundColor = "#f0f0f0");
    button.addEventListener("mouseout", () => button.style.backgroundColor = "white");

    document.body.appendChild(popup);
}

function closePopup() {
    const popup = document.getElementById("customPopup");
    if (popup) popup.remove();
}

