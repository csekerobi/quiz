const questionElement = document.getElementById("question");
const submitButton = document.getElementById("submit-btn");
const nextButton = document.getElementById("next-btn");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Fetch questions from JSON file
async function loadQuestions() {
  try {
    const response = await fetch('fill.json');
    questions = await response.json();
    startQuiz();
  } catch (error) {
    console.error("Failed to load questions:", error);
  }
}
loadQuestions();

// Initialize quiz
function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  resetControls();
  showQuestion();
}

// Reset controls for each question
function resetControls() {
  submitButton.disabled = true;
  nextButton.style.display = "none";
}

// Display the current question
function showQuestion() {
  resetControls();
  const currentQuestion = questions[currentQuestionIndex];

  // Update the question container with the question number and input field
  questionElement.innerHTML = `${currentQuestionIndex + 1}. ${currentQuestion.question.replace(
    "______",
    `<input id="dynamic-input" type="text" placeholder="Type your answer" class="dynamic-input" />`
  )}`;

  const dynamicInput = document.getElementById("dynamic-input");
  dynamicInput.addEventListener("input", () => {
    submitButton.disabled = !dynamicInput.value.trim();
  });

  dynamicInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !submitButton.disabled) {
      event.preventDefault();
      submitAnswer(dynamicInput);
    }
  });

  submitButton.onclick = () => submitAnswer(dynamicInput);
}

// Handle answer submission
function submitAnswer(inputField) {
  const userAnswer = inputField.value.trim().toLowerCase();
  const correctAnswer = questions[currentQuestionIndex].answer.toLowerCase();

  inputField.classList.toggle("correct", userAnswer === correctAnswer);
  inputField.classList.toggle("incorrect", userAnswer !== correctAnswer);

  if (userAnswer !== correctAnswer) inputField.value = questions[currentQuestionIndex].answer;

  inputField.disabled = true;
  submitButton.style.display = "none";
  nextButton.style.display = "inline-block";
}

// Handle next button click
function handleNextButton() {
  currentQuestionIndex++;
  currentQuestionIndex < questions.length ? showQuestion() : showScore();
}

// Display the final score
function showScore() {
  questionElement.innerText = `You scored ${score} out of ${questions.length}!`;
  submitButton.style.display = "none";
  nextButton.textContent = "Play Again";
  nextButton.onclick = startQuiz;
}

// Event listener for Next button
nextButton.addEventListener("click", handleNextButton);

