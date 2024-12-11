const questions = [
    {
        question: "What is the capital of France?",
        answers: [
            {text: "Madrid", correct: false},
            {text: "Berlin", correct: false},
            {text: "Paris", correct: true},
            {text: "Rome", correct: false},
        ]
    },
    {
        question: "Which planet is known as the Red Planet?",
        answers: [
            {text: "Mars", correct: true},
            {text: "Venus", correct: false},
            {text: "Jupiter", correct: false},
            {text: "Mercury", correct: false},
        ]
    },
    {
        question: "Who wrote the play Romeo and Juliet?",
        answers: [
            {text: "Charles Dickens", correct: false},
            {text: "William Shakespeare", correct: true},
            {text: "Jane Austen", correct: false},
            {text: "Mark Twain", correct: false},
        ]
    },
    {
        question: "What is the chemical symbol for water?",
        answers: [
            {text: "CO2", correct: false},
            {text: "H2O", correct: true},
            {text: "NaCl", correct: false},
            {text: "O2", correct: false},
        ]
    },
    {
        question: "Which continent is the Sahara Desert located in?",
        answers: [
            {text: "Asia", correct: false},
            {text: "Africa", correct: true},
            {text: "Australia", correct: false},
            {text: "South America", correct: false},
        ]
    }
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

// Initializes the quiz, resets the score, and shows the first question
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

// Displays the current question and its answers
function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add('btn');
        answerButtons.appendChild(button);
        if(answer.correct) {
            button.dataset.correct = answer.correct
        }
        button.addEventListener("click", selectAnswer)
    })
}

// Resets the state by hiding the next button and clearing old answers
function resetState() {
    nextButton.style.display = "none";
    while(answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

// Handles the answer selection, marking correct/incorrect answers
function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if(isCorrect){
        selectedBtn.classList.add("correct");
        score++;
    }else {
        selectedBtn.classList.add("incorrect")
    }
    Array.from(answerButtons.children).forEach(button =>{
        if(button.dataset.correct === "true"){
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = 'block'
}

// Displays the final score and a play again button
function showScore() {
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Play Again"
    nextButton.style.display = "block"
}

// Handles the next button click to show the next question or final score
function handleNextButton() {
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

// Adds a click event listener to the next button
nextButton.addEventListener("click", ()=>{
    if(currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        startQuiz();
    }
})

// Starts the quiz when the page loads
startQuiz();