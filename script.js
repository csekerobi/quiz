// Show instruction page first
const instructionPage = document.getElementById("instruction-page");
const quizPage = document.getElementById("quiz-page");
const startQuizButton = document.getElementById("start-quiz-btn");

// Hide instruction page and show quiz
startQuizButton.addEventListener("click", () => {
    instructionPage.classList.add("d-none");
    quizPage.classList.remove("d-none");
});

const questionElement = document.getElementById("question");
const answerArea = document.getElementById("answer-area");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let userAnswers = []; // Store user's answers for summary

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

// Feedback messages for correct and incorrect answers
const correctFeedback = ["Well done!", "Great work!", "You're right!", "Excellent!"];
const incorrectFeedback = ["Not quite.", "Try again!", "Incorrect.", "Better luck next time!"];

// Helper function to display feedback
function displayFeedback(isCorrect) {
    const feedbackMessage = document.createElement("div"); // Create a <div> for the feedback
    feedbackMessage.classList.add("feedback"); // Add a CSS class for styling

    feedbackMessage.textContent = isCorrect
        ? correctFeedback[Math.floor(Math.random() * correctFeedback.length)]
        : incorrectFeedback[Math.floor(Math.random() * incorrectFeedback.length)];

    answerArea.appendChild(feedbackMessage); // Append feedback to the answer area
}

// Initialize the quiz
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = []; // Reset user answers
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

// Record user's answer for summary
function recordAnswer(question, selectedAnswer, correctAnswer) {
    userAnswers.push({
        question: question.question,
        selectedAnswer: selectedAnswer,
        correctAnswer: correctAnswer,
    });
}

// Create an input field for fill-in-the-blank questions
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
        const userAnswer = inputField.value.trim();
        const correctAnswer = question.answer;

        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            inputField.classList.add("correct");
            score++;
            displayFeedback(true);
        } else {
            inputField.classList.add("incorrect");
            inputField.value = correctAnswer;
            displayFeedback(false);
        }

        recordAnswer(question, userAnswer, correctAnswer);
        inputField.disabled = true;
        submitButton.disabled = true;
        nextButton.disabled = false;
    };

    nextButton.disabled = true;
    nextButton.style.display = "inline-block";
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
                displayFeedback(true);
            } else {
                button.classList.add("incorrect");
                displayFeedback(false);

                Array.from(answerArea.children).forEach((btn) => {
                    if (btn.textContent === question.answers.find(a => a.correct).text) {
                        btn.classList.add("correct");
                    }
                });
            }

            recordAnswer(
                question,
                answer.text,
                question.answers.find(a => a.correct).text
            );

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
                displayFeedback(true);
            } else {
                button.classList.add("incorrect");
                displayFeedback(false);
            }

            recordAnswer(
                question,
                button.textContent,
                question.correct ? "True" : "False"
            );

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

    const summary = document.createElement("div");
    summary.classList.add("summary");

    userAnswers.forEach((entry, index) => {
        const isCorrect = entry.selectedAnswer?.toLowerCase() === entry.correctAnswer?.toLowerCase();
        const questionSummary = document.createElement("div");
        questionSummary.classList.add("question-summary"); // Add class for individual question summary

        questionSummary.innerHTML = `
            <p class="question-text"><strong>${index + 1}:</strong> ${entry.question}</p>
            <div class="answers-comparison">
                <span class="user-answer ${isCorrect ? 'answer-correct' : 'answer-incorrect'}">
                    <strong>Your Answer:</strong> ${entry.selectedAnswer || "No answer selected"}
                </span>
                <span class="correct-answer">
                    <strong>Correct Answer:</strong> ${entry.correctAnswer}
                </span>
            </div>
        `;
        summary.appendChild(questionSummary);
    });

    answerArea.appendChild(summary);

    nextButton.textContent = "Play Again";
    nextButton.style.display = "inline-block";
    nextButton.onclick = startQuiz;
}