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
    "Built into your web browser and contain methods that allow us to manipulate a web page via JavaScript.",
    "A part of the JavaScript language itself.",
    "Code that must be retrieved from somewhere on the Web.",
    "Low level code that directly control the computer's graphics functions."),
    new Question("Which of the following would change an element's background to red?",
    'element.setAttribute("style", "background-color: red");',
    'element.setAttribute("red");',
    'element.setAttribute("style", "red");',
    'element.setAttribute("class", "background: red");'),
    new Question("How would you append the following to the DOM? \n var myDiv = document.createElement('div')",
    'document.body.appendChild(myDiv);',
    'myDiv.appendChild.document.body;',
    'document.body.appendChild("div");',
    'document.body.appendChild = myDiv;'),
    new Question('What value would we add to setInterval() if we want a function called, myTimer() to run every 3 seconds?',
    'setInterval(myTimer, 3000)',
    'setInterval(myTimer, 3)',
    'setInterval(myTimer, 30)',
    'setInterval(myTimer, 300)'),
    new Question('Which attribute would we use to send an alert to the user when they click a specific element?',
    'onclick="alert(\'You clicked me.\')"',
    'ontoggle="alert(\'You clicked me.\')"',
    'onchange="alert(\'You clicked me.\')',
    'onclose="alert(\'You clicked me.\')"'),
    new Question('While creating a form for a client, you decide that you do not want the corresponding browser actions to happen, and you want to implement another behavior instead. What would you use to make this possible?',
    'event.preventDefault()',
    'event.dispatchEvent()',
    'event.stopAction()',
    'event.stopPropagation()'),
    new Question('You need to add an event listener to an element, pressEl, that checks to see if the element has been clicked and then runs myFunction(). Which of the following would you add to your code?',
    'pressEl.addEventListener("click", myFunction)',
    'addEventListener(pressEL, "mouseover", myFunction())',
    'addEventListener(pressEL, "click", myFunction)',
    'pressEl.addEventListener("keydown", myFunction())'),
    new Question('Where is data stored when it is persisted to local storage?',
    'In the client or browser.',
    'Under the Applications tab in Chrome Dev Tools.',
    'In the window called localStorage.',
    'In the database in the backend.'),
    new Question('Why do we need to convert an object into JSON in order for it to properly persist to local storage?',
    'Local storage can only store strings, so we convert the object to JSON to store it properly.',
    'Local storage cannot read JavaScript, so we convert JavaScript into JSON.',
    'Local storage only accepts JSON objects.',
    'It is convention to store objects using JSON, and we must follow that pattern so that our code is easy to read.'),
    new Question("You would like to set var classAttribute equal to an element's class attribute so that you can use the variable later in your code. Which of the following would accomplish this?",
    'var classAttribute = element.getAttribute("class");',
    'var classAttribute = element.setAttribute("class", "classAttribute);',
    'var classAttribute = element.removeAttribute("class);',
    'var classAttribute = element.setAttribute("class");'),
    new Question('You need to retrieve data with the key name of "formData" from local storage and convert it into an object. How would you accomplish this?',
    'var formData = JSON.parse(localStorage.getItem("formData"));',
    'var formData = JSON.stringify(localStorage.getItem("formData"));',
    'var formData = JSON.parse(localStorage.setItem("formData"));',
    'var formData = JSON.parse("formData");'),
    new Question("You just finished the feature that you've been working on a successfully merged your branch, feature-52. How would you delete branch, feature-52?",
    'git branch -d feature-52',
    'git merge feature-52',
    'git checkout feature-52',
    'git branch feature-52'),
    new Question("Which of the following is NOT an example of why we use client-side storage?",
    "It is best practice to use client-side storage to store sensitive information, like a user's payment information.",
    "It allows us to store the contents of a user's shopping cart from a previous session.",
    "We can use it to remember a user's preferences.",
    "It can allow a user to use a site without a network connection.")
];

// holds all sound effects
var sounds = {
    whistle: new Audio("./assets/sounds/whistle.mp3"),
    tick: new Audio("./assets/sounds/tick.mp3"),
    correct: new Audio("./assets/sounds/correct.mp3"),
    incorrect:  new Audio("./assets/sounds/incorrect.mp3"),

    play: function(soundName) {
        if (this[soundName] === undefined) { return; }
        this[soundName].play();
    }
}

const maxTime = 60;
var timeLeft = maxTime;
var countdownInterval;
const penaltyTime = 4;

var canAnswer = true;
var playing = false;

var numCorrectAnswers = 0;
var totalPoints = 0;

var availableQuestions;

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

    // check time to end quiz or warn of ending
    if (timeLeft <= 0) {
        endQuiz();
    }

    else if (timeLeft <= 10) {
        sounds.play('tick');

        // apply red coloring to timer
        if (!timeLimitElement.classList.contains('time-warning')) {
            timeLimitElement.classList.add("time-warning");
        }
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


function scrambleArray(array) {
    var copy = array.slice();
    var scrambledArray = [];

    while (copy.length > 0) {
        var randIndex = getRandomInt(copy.length);  // get random item in original array
        scrambledArray.push(copy[randIndex]);  // add it scrambled array
        copy.splice(randIndex, 1);  // delete random item from original array
    }

    return scrambledArray;
}


function nextQuestion() {
    if (!playing) { return; }

    // fade out old question
    quizSection.classList.remove("fade-in");
    quizSection.classList.add("fade-out");

    quizSection.addEventListener("animationend",
    // wait for fade animation to end to create next question
    (event) => {
        if (event.animationName !== "fadeOutRight") { return; }
        canAnswer = true;

        // remove previous question
        removeAllChildElements(quizSection);
        quizSection.classList.remove("fade-out");

        // generate a new question
        generateRandomQuestion();
    }, {once: true})
}


function correctAnswer() {
    if (!canAnswer) { return; }

    canAnswer = false;

    sounds.play('correct');

    numCorrectAnswers++;
    nextQuestion();
}


function incorrectAnswer(event) {
    if (!canAnswer) { return; }

    canAnswer = false;

    sounds.play('incorrect');

    // Make the clicked button shake
    if (event !== undefined) {
        var clickedButton = event.target;
        clickedButton.classList.add('incorrect-shake');
    }

    var answers = document.querySelectorAll('#quiz li button');
    answers.forEach(element => element.classList.add("no-cursor"));

    // cross out each incorrect answer
    var incorrectAnswers = document.querySelectorAll('[data-answer-type="incorrect"]');
    incorrectAnswers.forEach(element => element.classList.add("answer-crossed"));

    // display penalty timer bar
    var penaltyTimerBar = document.createElement('div');
    penaltyTimerBar.style.animationDuration = (penaltyTime - 0.01) + "s";
    penaltyTimerBar.classList.add('penalty-timer-bar');
    quizSection.appendChild(penaltyTimerBar);

    // delay the start of the next question
    setTimeout(nextQuestion, penaltyTime * 1000);
}


function endQuiz() {
    playing = false;
    stopCountdown();
    removeAllChildElements(quizSection);

    // play whistle sound
    sounds.play('whistle');

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
    if (!playing) { return; }

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
            answerElement.addEventListener("click", correctAnswer, {once: true});
            answerElement.dataset.answerType = "correct";
        }
        else {
            answerElement.addEventListener("click", (event) => {incorrectAnswer(event);}, {once: true} );
            answerElement.dataset.answerType = "incorrect";
        }

        var answerListItem = document.createElement("li");
        answerListItem.appendChild(answerElement);
        answersList.appendChild(answerListItem);
    }

    quizSection.appendChild(answersList);

    // fade in
    quizSection.classList.add('fade-in');

}


function startQuiz() {
    playing = true;
    canAnswer = true;

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
    generateRandomQuestion();

}

startButton.addEventListener("click", startQuiz);

// once page has loaded
window.onload = (event) => {
    timeText.innerHTML = maxTime;
}