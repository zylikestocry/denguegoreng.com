document.addEventListener("DOMContentLoaded", () => {
    const beforeImageInput = document.getElementById("beforeImage");
    const afterImageInput = document.getElementById("afterImage");
    const uploadStatus = document.getElementById("uploadStatus");

    function uploadFiles() {
        if (!beforeImageInput.files.length || !afterImageInput.files.length) {
            uploadStatus.innerText = "Please select both images.";
            return;
        }

        const user = firebase.auth().currentUser;
        if (!user) {
            uploadStatus.innerText = "Please sign in first.";
            return;
        }

        const userId = user.uid;
        const beforeFile = beforeImageInput.files[0];
        const afterFile = afterImageInput.files[0];

        const beforeRef = firebase.storage().ref(`user_uploads/${userId}/before_${Date.now()}.jpg`);
        const afterRef = firebase.storage().ref(`user_uploads/${userId}/after_${Date.now()}.jpg`);

        Promise.all([
            beforeRef.put(beforeFile),
            afterRef.put(afterFile)
        ]).then(() => {
            uploadStatus.innerText = "Images uploaded successfully!";
        }).catch(error => {
            uploadStatus.innerText = "Upload failed: " + error.message;
        });
    }

    document.getElementById("submitButton").addEventListener("click", uploadFiles);
});
