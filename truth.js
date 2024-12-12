
const questionElement = document.getElementById("question");
const trueButton = document.getElementById("true-btn");
const falseButton = document.getElementById("false-btn");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

// Fetch questions from the JSON file
async function loadQuestions() {
    try {
        const response = await fetch('truth.json');
        questions = await response.json();
        startQuiz();
    } catch (error) {
        console.error("Failed to load questions:", error);
    }
}
loadQuestions();

// Start or restart the quiz
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    trueButton.style.display = "inline-block";
    falseButton.style.display = "inline-block";
    showQuestion();
}

// Display the current question
function showQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;
}

// Reset state for the next question
function resetState() {
    trueButton.disabled = false;
    falseButton.disabled = false;
    nextButton.style.display = "none";
    trueButton.classList.remove("correct", "incorrect");
    falseButton.classList.remove("correct", "incorrect");
}


// Handle answer selection
function selectAnswer(isTrue) {
    const correct = questions[currentQuestionIndex].correct;
    if (isTrue === correct) {
        score++;
        trueButton.classList.add("correct");
        falseButton.classList.add("incorrect");
    } else {
        trueButton.classList.add("incorrect");
        falseButton.classList.add("correct");
    }
    trueButton.disabled = true;
    falseButton.disabled = true;
    nextButton.style.display = "inline-block";
}

// Show the next question or final score
function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

// Display the final score
function showScore() {
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    trueButton.style.display = "none";
    falseButton.style.display = "none";
    nextButton.innerHTML = "Play Again";
    nextButton.onclick = startQuiz;
}

// Event listeners
trueButton.addEventListener("click", () => selectAnswer(true));
falseButton.addEventListener("click", () => selectAnswer(false));
nextButton.addEventListener("click", handleNextButton);

