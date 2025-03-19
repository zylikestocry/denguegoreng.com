let score = 0;

function selectAnswer(option, correctness) {
    // Remove previous selections
    let options = option.parentElement.querySelectorAll("li");
    options.forEach(opt => opt.style.background = "#1e3a8a");

    // Highlight selected answer
    if (correctness === "correct") {
        option.style.background = "#28a745"; // Green for correct
    } else {
        option.style.background = "#dc3545"; // Red for wrong
    }

    // Update score
    if (correctness === "correct") {
        score++;
    }
}

function calculateScore() {
    let resultBox = document.getElementById("result");
    resultBox.style.display = "block";

    if (score === 3) {
        resultBox.innerHTML = "🎉 Perfect Score! You know how to prevent dengue!";
        resultBox.style.color = "#28a745";
    } else if (score === 2) {
        resultBox.innerHTML = "👍 Good Job! But there's still more to learn.";
        resultBox.style.color = "#ffcc00";
    } else {
        resultBox.innerHTML = "😟 You need to learn more about dengue prevention!";
        resultBox.style.color = "#dc3545";
    }

    score = 0; // Reset score for future attempts
}
