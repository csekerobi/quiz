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

// Feedback messages for correct and incorrect answers
const correctFeedback = ["Well done!", "Great work!", "You're right!", "Excellent!"];
const incorrectFeedback = ["Not quite.", "Try again!", "Incorrect.", "Better luck next time!"];

// Helper function to display feedback
// Dynamically creates and displays feedback based on the user's answer
function displayFeedback(isCorrect) {
    const feedbackMessage = document.createElement("div"); // Create a <div> for the feedback
    feedbackMessage.classList.add("feedback"); // Add a CSS class for styling

    // Randomly select a feedback message
    feedbackMessage.textContent = isCorrect
        ? correctFeedback[Math.floor(Math.random() * correctFeedback.length)] // Correct feedback
        : incorrectFeedback[Math.floor(Math.random() * incorrectFeedback.length)]; // Incorrect feedback

    answerArea.appendChild(feedbackMessage); // Append feedback to the answer area
}

// Initialize the quiz
function startQuiz() {
    currentQuestionIndex = 0; // Reset question index
    score = 0; // Reset score
    nextButton.textContent = "Next"; // Reset button text
    nextButton.disabled = true; // Disable next button initially
    showQuestion();
}

// Display the current question based on its type
function showQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex]; // Get the current question

    // Display the question text
    questionElement.textContent = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;

    // Display input or buttons based on question type
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
    nextButton.style.display = "none"; // Hide the next button
    while (answerArea.firstChild) {
        answerArea.removeChild(answerArea.firstChild); // Clear all child elements
    }
}

// Create an input field for fill-in-the-blank questions
function createInputField(question) {
    const inputField = document.createElement("input"); // Create an input element
    inputField.type = "text"; // Set input type to text
    inputField.placeholder = "Type your answer"; // Placeholder text
    inputField.classList.add("dynamic-input"); // Add CSS class for styling
    answerArea.appendChild(inputField); // Append input to answer area

    const submitButton = document.createElement("button"); // Create a submit button
    submitButton.textContent = "Submit"; // Set button text
    submitButton.classList.add("btn"); // Add CSS class for styling
    submitButton.disabled = true; // Disable button until input is provided
    answerArea.appendChild(submitButton); // Append button to answer area

    // Enable submit button only when input is not empty
    inputField.addEventListener("input", () => {
        submitButton.disabled = !inputField.value.trim();
    });

    // Check the answer when the submit button is clicked
    submitButton.onclick = () => {
        checkFillBlankAnswer(question, inputField, submitButton);
    };

    nextButton.disabled = true; // Disable next button
    nextButton.style.display = "inline-block"; // Show next button
}

// Check answer for fill-in-the-blank questions
function checkFillBlankAnswer(question, inputField, submitButton) {
    const userAnswer = inputField.value.trim().toLowerCase(); // Get user's answer in lowercase
    const correctAnswer = question.answer.toLowerCase(); // Correct answer in lowercase

    // Determine correctness and provide the feedback
    if (userAnswer === correctAnswer) {
        inputField.classList.add("correct"); // Highlight input as correct
        score++; // increment score
        displayFeedback(true); // Show correct feedback
    } else {
        inputField.classList.add("incorrect"); // Highlight input as incorrect
        inputField.value = question.answer; // Show the correct answer
        displayFeedback(false); // Show incorrect feedback
    }
    inputField.disabled = true; // Disable input field
    submitButton.disabled = true; // Disable submit button
    nextButton.disabled = false; // Enable next button
}

// Create buttons for multiple-choice questions
function createMultipleChoiceButtons(question) {
    question.answers.forEach((answer) => {
        const button = document.createElement("button"); // Create a button for each answer
        button.textContent = answer.text; // Set button text
        button.classList.add("btn"); // Add CSS class for styling
        answerArea.appendChild(button); // Append button to answer area

    // Determine correctness and provide the feedback
        button.onclick = () => {
            if (answer.correct) {
                button.classList.add("correct");
                score++;
                displayFeedback(true);
            } else {
                button.classList.add("incorrect");
                displayFeedback(false);

                // Highlight the correct answer
                Array.from(answerArea.children).forEach((btn) => {
                    if (btn.textContent === question.answers.find(a => a.correct).text) {
                        btn.classList.add("correct");
                    }
                });
            }
            disableAllButtons();
            nextButton.style.display = "inline-block"; // Show next button
            nextButton.disabled = false; // Enable next button
        };
    });
}

// Create buttons for true/false questions
function createTrueFalseButtons(question) {
    [true, false].forEach((value) => {
        const button = document.createElement("button"); // Create a button for true/false
        button.textContent = value ? "True" : "False"; // Set button text
        button.classList.add("btn"); // Add CSS class for styling
        answerArea.appendChild(button); // Append button to answer area

        // Determine correctness and provide the feedback
        button.onclick = () => {
            if (value === question.correct) {
                button.classList.add("correct");
                score++;
                displayFeedback(true);
            } else {
                button.classList.add("incorrect");
                displayFeedback(false);
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
        button.disabled = true; // Disable each button
    });
}

// Shuffle array utility function
// Randomizes the order of an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Generate a random index
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array; // Return the shuffled array
}

// Show the next question or final score
nextButton.addEventListener("click", () => {
    currentQuestionIndex++; // Move to the next question
    if (currentQuestionIndex < questions.length) {
        showQuestion(); // Show the next question
    } else {
        showScore(); // Show the final score
    }
});

// Display the final score
function showScore() {
    resetState();
    questionElement.textContent = `You scored ${score} out of ${questions.length}!`; // Display score
    nextButton.textContent = "Play Again";
    nextButton.style.display = "inline-block";
    nextButton.onclick = startQuiz;
}
