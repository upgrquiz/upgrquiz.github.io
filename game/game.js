const question = document.getElementById('question'); //getting element by id from html
const choices = Array.from(document.getElementsByClassName('choice-text')); //array of choices because we have 4 choices
//getting by class from html
const progressText = document.getElementById('progressText');// getting by id from html
const scoreText = document.getElementById('score');//by id from html
const progressBarFull = document.getElementById('progressBarFull');//by id from html
const loader = document.getElementById('loader');//by id from html
const game = document.getElementById('game');//by id from hmtl
let currentQuestion = {};
let acceptingAnswers = false; //to make so, that user can answer after every is loaded
let score = 0;//to show a score
let questionCounter = 0;//to show in which question you are
let availableQuesions = [];
const timeCount = document.querySelector(".time .sec");

let questions = [];
let counter;
let timeValue = 30;

var setTheme = localStorage.getItem('theme')
var setGameTheme = localStorage.getItem('game')
		console.log('game:', setGameTheme)

		if (setGameTheme == null) {
            if (setTheme == 'app.css') {
                swapStyle('app.css', 'game.css')
            }
            else if (setTheme == 'appdark.css') {
                swapStyle('appdark.css', 'gamedark.css')
            }
		} 
        else if (setTheme == 'app.css') {
            swapStyle('app.css', 'game.css')
        }
        else if (setTheme == 'appdark.css') {
            swapStyle('appdark.css', 'gamedark.css')
        }
        else{
			swapStyle(setTheme, setGameTheme)
		}

		function swapStyle(sheet, gamesheet){
			document.getElementById('mystylesheet').href = sheet
			localStorage.setItem('theme', sheet);
            document.getElementById('mystylegame').href = gamesheet;
            localStorage.setItem('game', gamesheet)
		}

fetch(
    'https://opentdb.com/api.php?amount=10&category=18&type=multiple'
)
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });

        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

//CONSTANTS
const CORRECT_BONUS = 10;//score per correct answer 
const MAX_QUESTIONS = 10;//question number

startGame = () => { //funtion 
    questionCounter = 0; //it should be 0 in the beginning
    score = 0;//score too
    availableQuesions = [...questions]; //putting every element from questions to array by '...' 
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

getNewQuestion = () => {
    clearInterval(counter);
    startTimer(timeValue);
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) { //if user get to ther last question
        localStorage.setItem('mostRecentScore', score); 
        //go to the end page
        return window.location.assign('/end.html'); 
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);//to get random questions from avalable once
    //and we are using length of available question to don't get repeated questions, 
    ///because it will change every time when we get index by function splice below
    currentQuestion = availableQuesions[questionIndex]; //and getting question with this id
    question.innerText = currentQuestion.question;// getting text of question 

    choices.forEach((choice) => { //foreach loop to use all choices 
        const number = choice.dataset['number']; //getting number of choice (data-number)
        choice.innerText = currentQuestion['choice' + number]; 
        //to put choices of answer for question by relevant data-number 
        //in choice with data-number 1 will be first answer choice and so on
    });

    availableQuesions.splice(questionIndex, 1);//to not use question that we already used
    acceptingAnswers = true;//when everything is loaded, user can asnwer to questions.

};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {//event when user clicks to choice
        clearInterval(counter);
        if (!acceptingAnswers) return; //so if interface is not loaded, it will ignore a click

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number']; //gets answer by data-number

        const classToApply = //if selected Answer by user is the same as correct answer then it will be correct
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'; //and otherwise, it will be incorrect

        if (classToApply === 'correct') { //if user answered correctly
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply); //it adds class to parent element (div)
        // <div class = "choice-container"> --> <div class = "choice-container correct"> 

        //js function to set timeout, to give delay for color when user answers
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);//removing classToApply from div
            getNewQuestion(); //recalling getNewQuestion function for next question
        }, 1000);//it second paramert there is time (1s)
    });
});

incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};


function startTimer(time) {
    counter = setInterval(timer, 1000);
    function timer() {
        timeCount.textContent = time;
        time--;
        if(time < 9){ //if timer is less than 9
            let addZero = timeCount.textContent; 
            timeCount.textContent = "0" + addZero; //add a 0 before time value
        }
        if(time < 0){ //if timer is less than 0
            getNewQuestion();
        }
    }
}


