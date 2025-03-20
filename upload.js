// Ensure Firebase is initialized
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage-compat.js";

const auth = getAuth();
const storage = getStorage();

// Function to upload files
function uploadFiles() {
    const beforeFile = document.getElementById('beforeImage').files[0];
    const afterFile = document.getElementById('afterImage').files[0];
    const uploadStatus = document.getElementById('uploadStatus');

    if (!beforeFile || !afterFile) {
        uploadStatus.textContent = "Please select both images.";
        return;
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userId = user.uid; // Unique user ID
            const beforeRef = ref(storage, `user_uploads/${userId}/before.jpg`);
            const afterRef = ref(storage, `user_uploads/${userId}/after.jpg`);

            // Upload both images
            uploadBytes(beforeRef, beforeFile).then(() => {
                return uploadBytes(afterRef, afterFile);
            }).then(() => {
                uploadStatus.textContent = "Upload successful!";
                return Promise.all([getDownloadURL(beforeRef), getDownloadURL(afterRef)]);
            }).then((urls) => {
                console.log("Before Image URL:", urls[0]);
                console.log("After Image URL:", urls[1]);
            }).catch(error => {
                uploadStatus.textContent = "Upload failed: " + error.message;
            });
        } else {
            uploadStatus.textContent = "You must be signed in to upload.";
        }
    });
}
