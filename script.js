const questionElement = document.getElementById("question");
const answerArea = document.getElementById("answer-area");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

// Fetch combined questions from the JSON file
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        questions = shuffleArray(questions); // Shuffle questions for randomness
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
    nextButton.textContent = "Next";
    nextButton.disabled = true;
    showQuestion();
}

// Display the current question based on its type
function showQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];

    questionElement.textContent = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;

    if (currentQuestion.type === "fill-blank") {
        createInputField(currentQuestion);
    } else if (currentQuestion.type === "multiple-choice") {
        createMultipleChoiceButtons(currentQuestion);
    } else if (currentQuestion.type === "true-false") {
        createTrueFalseButtons(currentQuestion);
    }
}

// Reset the state for the next question
function resetState() {
    nextButton.style.display = "none";
    while (answerArea.firstChild) {
        answerArea.removeChild(answerArea.firstChild);
    }
}

// Create input field for fill-in-the-blank questions
function createInputField(question) {
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.placeholder = "Type your answer";
    inputField.classList.add("dynamic-input");
    answerArea.appendChild(inputField);

    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.classList.add("btn");
    submitButton.disabled = true;
    answerArea.appendChild(submitButton);

    inputField.addEventListener("input", () => {
        submitButton.disabled = !inputField.value.trim();
    });

    submitButton.onclick = () => {
        checkFillBlankAnswer(question, inputField, submitButton);
    };

    nextButton.disabled = true;
    nextButton.style.display = "inline-block";
}

// Check answer for fill-in-the-blank questions
function checkFillBlankAnswer(question, inputField, submitButton) {
    const userAnswer = inputField.value.trim().toLowerCase();
    const correctAnswer = question.answer.toLowerCase();

    if (userAnswer === correctAnswer) {
        inputField.classList.add("correct");
        score++;
    } else {
        inputField.classList.add("incorrect");
        inputField.value = question.answer; // Show correct answer after submission
    }
    inputField.disabled = true;
    submitButton.disabled = true;
    nextButton.disabled = false;
}

// Create buttons for multiple-choice questions
function createMultipleChoiceButtons(question) {
    question.answers.forEach((answer) => {
        const button = document.createElement("button");
        button.textContent = answer.text;
        button.classList.add("btn");
        answerArea.appendChild(button);

        button.onclick = () => {
            if (answer.correct) {
                button.classList.add("correct");
                score++;
            } else {
                button.classList.add("incorrect");
            }
            disableAllButtons();
            nextButton.style.display = "inline-block";
            nextButton.disabled = false;
        };
    });
}

// Create buttons for true/false questions
function createTrueFalseButtons(question) {
    [true, false].forEach((value) => {
        const button = document.createElement("button");
        button.textContent = value ? "True" : "False";
        button.classList.add("btn");
        answerArea.appendChild(button);

        button.onclick = () => {
            if (value === question.correct) {
                button.classList.add("correct");
                score++;
            } else {
                button.classList.add("incorrect");
            }
            disableAllButtons();
            nextButton.style.display = "inline-block";
            nextButton.disabled = false;
        };
    });
}

// Disable all buttons after a selection
function disableAllButtons() {
    Array.from(answerArea.children).forEach((button) => {
        button.disabled = true;
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
    });
}

// Shuffle array utility function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Show the next question or final score
nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
});

// Display the final score
function showScore() {
    resetState();
    questionElement.textContent = `You scored ${score} out of ${questions.length}!`;
    nextButton.textContent = "Play Again";
    nextButton.style.display = "inline-block";
    nextButton.onclick = startQuiz;
}
