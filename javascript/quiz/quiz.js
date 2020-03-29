var quiz = {
    score: 0,
    seconds: 10,
    timer: null,
    currentQuestion: 0,
    quizEl: document.getElementById('quiz'),
    startBtnEl: document.createElement('button'),
    questionEl: document.createElement('h2'),
    answersEl: document.createElement('ol'),
    scoreEl: document.createElement('div'),
    verdictEl: document.createElement('p'),
    nextBtnEl: document.createElement('button'),
    againBtnEl: document.createElement('button'),
    counterEl: document.createElement('div'),
    timerEl: document.createElement('div'),
    linkEl: document.createElement('link'),
    configEl: document.createElement('script'),
    questions: [],
    verdicts: []
};

quiz.init = function(){

    // set start button text
    this.startBtnEl.textContent = "Let's get started"; 
    this.againBtnEl.textContent = "Replay";

    // add click event handler to start button
    this.startBtnEl.onclick = function(){
        quiz.startQuiz();
    }
    //add click event handler to again button
    this.againBtnEl.onclick = function(){
        console.log("start again");
        quiz.currentQuestion = 0;
        quiz.score = 0;
        quiz.seconds = 0;
        quiz.questionEl.style.display = 'block';
        quiz.answersEl.style.display = 'block';
        quiz.timerEl.style.display = 'block';
        quiz.counterEl.style.display = "block";
        quiz.scoreEl.style.display = "block";
        quiz.quizEl.innerHTML = "";
        quiz.startQuiz();
    };

    // append startBtn to DOM
    this.quizEl.appendChild(this.startBtnEl);
};

quiz.startQuiz = function(){

    // check that we have questions set
    if (this.questions == null || this.questions.length == 0){
        throw new Error("No questions");
    };    

    //hide start button
    this.startBtnEl.style.display = "none";

    //Set next button text and hide it
    this.nextBtnEl.textContent = "Next Question";
    this.nextBtnEl.style.display = "none";

    //Next button click event handler
    this.nextBtnEl.onclick = function(){
        quiz.currentQuestion += 1;
        quiz.updateQuestion();
    };

    // Set questionEl text
    this.questionEl.textContent = this.questions[this.currentQuestion].question;
-
    //Add elements to DOM
    this.quizEl.appendChild(this.counterEl);
    this.quizEl.appendChild(this.questionEl);
    this.quizEl.appendChild(this.answersEl);
    this.quizEl.appendChild(this.scoreEl);
    this.quizEl.appendChild(this.timerEl);
    this.quizEl.appendChild(this.verdictEl);
    this.quizEl.appendChild(this.nextBtnEl);
    
    /*this.timer = setInterval(function(){
        quiz.updateTime();
    */
   //}, 1000);

    this.updateTime();
    this.updateScore();
    this.updateQuestion();
};

quiz.updateTime = function(){
    if(this.seconds == -1){
        this.verdictEl.textContent = "Too slow!";
        this.answersEl.classList.add("disabled");
        this.nextBtnEl.style.display = "block";
        clearInterval(this.timer);
        return this.timer;
    }

    //var hours = Math.floor(this.seconds / 60 / 60);
    //var minutes = (this.seconds / 60) - (hours * 60);
    //var seconds = this.seconds % 60;

    this.timerEl.textContent = "Time: " + this.seconds;
    this.seconds--;
}
/**
 * Updates score element text
 */

quiz.updateScore = function (){
    this.scoreEl.textContent = "Score: " + this.score + " / 10";
};

// updates the question and answers element texts
quiz.updateQuestion = function(){

    //check if we have reached the last question
    if(this.currentQuestion == this.questions.length){
        console.log("that was the last question");
        this.finalVerdict();
        return;
    };
    this.seconds = 10;

    this.timer = setInterval(function(){
        quiz.updateTime();    
    }, 1000);

    // Set counter text
    this.counterEl.textContent = "Question " + (this.currentQuestion + 1) + " / " + this.questions.length;

    // Set questionEl text
    this.questionEl.textContent = this.questions[this.currentQuestion].question;

    //Clear answers list
    this.answersEl.innerHTML = "";
    this.answersEl.classList.remove("disabled");

    //clear verdict
    this.verdictEl.textContent = "";

    //Hide next button
    this.nextBtnEl.style.display = "none";

    for (var i in this.questions[this.currentQuestion].answers){
        var li = document.createElement("li");
        li.textContent = this.questions[this.currentQuestion].answers[i];
        
        //put letter to data-letter attribute
        li.dataset.letter = i;
        
        //li click event handler
        li.onclick = function() {
            //console.log(this.dataset.letter + ": " + this.textContent);
            if (! quiz.answersEl.classList.contains("disabled")){
                quiz.checkAnswer(this.dataset.letter);
            }
        };
        
        this.answersEl.appendChild(li);
    };
};
/**
 * Checks the answer and shows right/wrong and next button
 * @param {string} answerLetter
 */

quiz.checkAnswer = function(answerLetter){
    //console.log('klikkasit ' + answerLetter);

    var answerLi = document.querySelector("li[data-letter='" + answerLetter + "']");

    if (answerLetter == this.questions[this.currentQuestion].correctAnswer){
        this.score += 1;
        answerLi.classList.add("right");
        this.updateScore();
        this.verdictEl.textContent = "Correct!";
        clearInterval(this.timer);

    } else {
        answerLi.classList.add("wrong");
        this.verdictEl.textContent = "Wrong!";
        clearInterval(this.timer);

    }
    //Disable answers
    this.answersEl.classList.add("disabled");
    this.nextBtnEl.style.display = "block";

    //clear time if this was the last question
    if (this.currentQuestion == this.questions.length -1){

    }

};

/**
 * Displays the final verdict based on score
 */

quiz.finalVerdict = function(){
    // Hide unnecessary stuff

    this.questionEl.style.display = "none";
    this.answersEl.style.display = "none";
    this.nextBtnEl.style.display = "none";
    this.counterEl.style.display = "none";
    this.scoreEl.style.display = "none";
    this.timerEl.style.display = "none";

    var percentage = (this.score / this.questions.length) * 100;

    console.log(percentage + " %");

    this.verdictEl.textContent = "You got " + Math.round(percentage) + "%. ";

    //loop through verdicts
    for (var i in this.verdicts){
        if(percentage >= this.verdicts[i].minScore){
            this.verdictEl.textContent += this.verdicts[i].text;
            break;
        }
    }
    // add again button to DOM
    this.quizEl.appendChild(this.againBtnEl);
};

//console.log(quiz);

// Load stylesheet
quiz.linkEl.rel = 'stylesheet';
quiz.linkEl.href = quiz.quizEl.dataset.path + 'quiz/quiz.css';
//just testing
quiz.linkEl.onload = function() {
    console.log("Styles loaded");
}

document.head.appendChild(quiz.linkEl);

// check if config path is set via data attribute
if(quiz.quizEl.dataset.config){
    console.log("On data-config: " + quiz.quizEl.dataset.config)
    quiz.configEl.src = quiz.quizEl.dataset.config;

    // Init quiz after config has loaded
    quiz.configEl.onload = function(){
        console.log("quiz config loaded");
        quiz.init();
    };
    document.head.appendChild(quiz.configEl);
} 
else {
    quiz.init();
}


