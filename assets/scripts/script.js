class Question {
    constructor(question, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3) {
        this.question = question;
        this.correctAnswer = correctAnswer;
        this.incorrectAnswer1 = incorrectAnswer1;
        this.incorrectAnswer2 = incorrectAnswer2;
        this.incorrectAnswer3 = incorrectAnswer3;
    }
}

const questions = [
    new Question("Which of the following best describes a Web API?",
    "Web APIs are built into your web browser and contain methods that allow us to manipulate a web page via JavaScript.",
    "A part of the JavaScript language itself.",
    "Web APIs are not built into the browser by default, and you generally have to retrieve their code and information from somewhere on the Web.",
    "Low level code that directly control the computer's graphics functions."),
    new Question("Which of the following would change an element's background to red?",
    'element.setAttribute("style", "background-color: red");',
    'element.setAttribute("red");',
    'element.setAttribute("style", "red");',
    'element.setAttribute("class", "background: red");')
];

const maxTime = 60;
var timeLeft = maxTime;
var countdownInterval;

var canAnswer = true;

var numCorrectAnswers = 0;
var totalPoints = 0;

var availableQuestions;

var whistleSound;
var tickSound;
var correctSound;
var incorrectSound;


var startSection = document.getElementById("start");
var quizSection = document.getElementById("quiz");
var endSection = document.getElementById("end");

var startButton = document.getElementById('btn-start');
var footer = document.querySelector("footer");

var timeLimitElement = document.querySelector(".time-limit");
var timeText = document.getElementById("time");


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


function hideElement(element) {
    element.style.display = "none";
}


function showElement(element) {
    element.style.display = "block";
}



function removeAllChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


function countDown() {
    // reduce time left and update display
    timeLeft--;
    timeText.innerHTML = timeLeft;

    // play tick sound
    // tickSound.play()

    // check time to end quiz or warn of ending
    if (timeLeft <= 0) {
        endQuiz();
    }

    else if (timeLeft === 10) {
        timeLimitElement.classList.add("time-warning");
    }
}

function startCountdown() {
    // reset timeLeft and begin countdown
    timeLeft = maxTime;
    countdownInterval = setInterval(countDown, 1000);
}

function stopCountdown() {
    clearInterval(countdownInterval);
    timeLimitElement.classList.remove("time-warning");
}


// TODO: make array scramble algorithm
function scrambleArray(array) {
    return array;
}


function nextQuestion() {
    canAnswer = true;

    // remove previous question
    removeAllChildElements(quizSection);

    // generate a new question
    generateRandomQuestion();
}


function correctAnswer() {
    if (!canAnswer) { return; }

    canAnswer = false;

    correctSound.play();

    numCorrectAnswers++;
    console.log("correct!");
    nextQuestion();
}


function incorrectAnswer() {
    if (!canAnswer) { return; }

    canAnswer = false;

    incorrectSound.play();

    var answers = document.querySelectorAll('#quiz li button');
    answers.forEach(element => element.classList.add("no-cursor"));

    // cross out each incorrect answer
    var incorrectAnswers = document.querySelectorAll('[data-answer-type="incorrect"]');
    incorrectAnswers.forEach(element => element.classList.add("answer-crossed"));

    // delay the start of the next question
    setTimeout(nextQuestion, 3000);
}


function endQuiz() {
    stopCountdown();
    removeAllChildElements(quizSection);

    // play whistle sound
    whistleSound.play();

    var endStatement = document.createElement("p");
    var bonusStatement = document.createElement("p");
    var pointsStatement = document.createElement("p");
    var tryAgainButton = document.createElement("button");

    // create end statement
    var plural = "s";
    if (numCorrectAnswers === 1) { plural = ""; }
    endStatement.innerHTML = "You finished the quiz with " + numCorrectAnswers + " correct answer" + plural + ".";

    // bonus statement
    bonusStatement.innerHTML = "";
    if (timeLeft > 0) {
        bonusStatement.innerHTML = "Congratulations, you finished the quiz with extra time! You've earned an extra " + timeLeft + " points.";
    }

    totalPoints = numCorrectAnswers + timeLeft;

    plural = "s";
    if (totalPoints === 1) {plural = ""; }

    // points statement
    pointsStatement.innerHTML = "You have earned a total of " + totalPoints + " point" + plural + ".";

    // try again button
    tryAgainButton.innerHTML = "Try Again";
    tryAgainButton.addEventListener("click", startQuiz);

    // add all elements to section
    endSection.appendChild(endStatement);
    endSection.appendChild(bonusStatement);
    endSection.appendChild(pointsStatement);
    endSection.appendChild(tryAgainButton);

    // show footer
    showElement(footer);
}


function generateRandomQuestion() {
    if (availableQuestions.length < 1) {
        endQuiz();
        return;
    }

    // get a random question
    var randIndex = getRandomInt(availableQuestions.length);
    var randQuestion = availableQuestions[randIndex];

    // remove question from available questions
    availableQuestions.splice(randIndex, 1);

    // generate question text
    var questionElement = document.createElement("p");
    questionElement.classList.add("question-text");
    questionElement.innerHTML = randQuestion.question;

    // add question to DOM
    quizSection.appendChild(questionElement);

    // get random order of questions
    var answers = scrambleArray([randQuestion.correctAnswer, randQuestion.incorrectAnswer1, randQuestion.incorrectAnswer2, randQuestion.incorrectAnswer3]);

    // create answers list element
    var answersList = document.createElement("ol");
    answersList.setAttribute("type", "A");

    // generate answer buttons
    for (var i = 0; i < answers.length; i++) {
        var answer = answers[i];
        var answerElement = document.createElement("button");
        answerElement.style.display = "block";
        answerElement.innerHTML = answer;

        if (answer === randQuestion.correctAnswer) {
            answerElement.addEventListener("click", correctAnswer);
            answerElement.dataset.answerType = "correct";
        }
        else {
            answerElement.addEventListener("click", incorrectAnswer);
            answerElement.dataset.answerType = "incorrect";
        }

        var answerListItem = document.createElement("li");
        answerListItem.appendChild(answerElement);
        answersList.appendChild(answerListItem);
    }

    quizSection.appendChild(answersList);

}


function startQuiz() {
    // reset stats
    numCorrectAnswers = 0;
    totalPoints = 0;

    // hide start menu and footer
    hideElement(startSection);
    hideElement(footer);

    // delete anything from end section
    removeAllChildElements(endSection);

    // reset available quesitons
    availableQuestions = questions.slice();

    // start countdown
    timeLeft = maxTime;
    timeText.innerHTML = timeLeft;
    startCountdown();

    // generate a random question
    nextQuestion();

}

startButton.addEventListener("click", startQuiz);

// once page has loaded
window.onload = (event) => {
    timeText.innerHTML = maxTime;

    whistleSound = new Audio("./assets/sounds/whistle.mp3");
    tickSound = new Audio("./assets/sounds/tick.mp3");
    correctSound = new Audio("./assets/sounds/correct.mp3");
    incorrectSound = new Audio("./assets/sounds/incorrect.mp3");
}