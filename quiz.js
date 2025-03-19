function submitQuiz() {
    let answers = {
        q1: "B",
        q2: "B",
        q3: "B",
        q4: "A",
        q5: "A",
        q6: "B",
        q7: "B",
        q8: "B",
        q9: "B",
        q10: "B"
    };

    let score = 0;
    let totalQuestions = Object.keys(answers).length;

    let resultBox = document.getElementById("result");
    if (!resultBox) {
        console.error("Error: Result box not found!");
        return;
    }

    // Loop through answers and check correctness
    for (let key in answers) {
        let selectedOption = document.querySelector(`input[name="${key}"]:checked`);

        if (selectedOption) {
            let parentLabel = selectedOption.parentElement;

            // Reset styles first
            let options = document.getElementsByName(key);
            options.forEach(opt => opt.parentElement.style.color = "black"); // Reset to default

            if (selectedOption.value === answers[key]) {
                score++;
                parentLabel.style.color = "#28a745"; // Green for correct
            } else {
                parentLabel.style.color = "#dc3545"; // Red for wrong
            }
        }
    }

    // Generate feedback message
    resultBox.classList.remove("hidden");

    let message = "";
    if (score === totalQuestions) {
        message = "🏆 Perfect score! You're a **Dengue Slayer**! Keep up the great work! 💪";
    } else if (score >= 7) {
        message = "👍 Great job! You know how to prevent dengue, but there's always more to learn!";
    } else if (score >= 4) {
        message = "🤔 Not bad! But you need to learn more to fight dengue effectively!";
    } else {
        message = "😟 Uh-oh! You need to improve your knowledge to stay safe from dengue!";
    }

    resultBox.innerHTML = `<p>Your Score: <strong>${score}/${totalQuestions}</strong></p><p>${message}</p>`;
}
