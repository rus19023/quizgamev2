// TODO:  allow and check for number of correct answers to be selected
// TODO:  push selected plural answers to array, then check against correct answer array?
var jsonFile;
var getNewQuestion;
var selectGame = ( gameChoice ) => {
    var fileName = document.getElementById('gameChoice').value;
    //console.log('fileName., line 7: ' + fileName);
    if (fileName.includes('.json')) {
        jsonFile  = "./jsonfiles/" + fileName;
    } else {
        jsonFile = fileName;
    }
    if (fileName.includes('240')) {
        document.documentElement.style.setProperty('--theme', '#84fbff');
    }
    else if (fileName.includes('241')) {
            document.documentElement.style.setProperty('--theme', '#d8b066');
    }
    else if (fileName.includes('270')) {
        document.documentElement.style.setProperty('--theme', '#fd96e7');
    }
    else if (fileName.includes('325')) {
        document.documentElement.style.setProperty('--theme', '#89acfd');
    }
    else if (fileName.includes('352')) {
        document.documentElement.style.setProperty('--theme', '#88ddac');
    } else {
        document.documentElement.style.setProperty('--theme', '#ce88fd');
    }
    const question = document.getElementById('question');
    const choices = Array.from(document.getElementsByClassName('choice-text'));
    const progressText = document.getElementById('progressText');
    const scoreText = document.getElementById('score');
    const progressBarFull = document.getElementById('progressBarFull');
    const loader = document.getElementById('loader');
    // const hud = document.getElementById('hud');
    const game = document.getElementById('game');
    const nextButton = document.getElementById('next-button');
    //debugger;
    let currentQuestion = {};
    let acceptingAnswers = false;
    let score = 0;
    let questionCounter = 0;
    let availableQuestions = [];
    let bonusText = 'Go get your name on the leaderboard!';
    let bonus = document.getElementById('bonus-text');
    let bonusesReached = 1;
    let numAnswers = 0;
    //const jsonFileName = 'CIT241-EXAM2';
    // my added variables for bonus and grade score
    //let totalCorrect = 0;
    let consecutiveCorrect = 0;
    let lastCorrect = false;

    /* CONSTANTS  */
    const CORRECT_BONUS = 100;
    const CORRECT_POINTS = 100;
    const MAX_QUESTIONS = 30;

    var startGame = () => {
        questionCounter = 0;
        score = 0;
        availableQuestions = [...questions];
        getNewQuestion();
        game.classList.remove('hidden');
        loader.classList.add('hidden');
        //localStorage.clear();
    };
    let questions = [];
    //console.log("DEBUG: line 52, jsonFile: " + jsonFile);
    fetch(jsonFile)
        .then((res) => {
            console.log(res);
            if (!res.ok) {
                //throw new Error("HTTP error " + response.status);
                console.error(err);
            }
            console.log('res.data: ' + res);
            return res.json();
        })
        .then((loadedQuestions) => {
            questions = loadedQuestions.results.map((loadedQuestion) => {
                const formattedQuestion = {
                    //question: loadedQuestion.question + " <br><br> (From " + loadedQuestion.category +")",
                    explanation: loadedQuestion.explanation,
                    exam: loadedQuestion.difficulty,
                    quiz: loadedQuestion.type,
                    week: loadedQuestion.category,
                    section: loadedQuestion.section,
                    correct: loadedQuestion.correct_answer,
                    qnum: loadedQuestion.qnum, 
                    question: loadedQuestion.question + " <br><br> (From " + loadedQuestion.section + " Question# " + loadedQuestion.qnum +")",
                };
                // use the question if the category is correct

           
                questions = loadedQuestions;
                const answerChoices = [...loadedQuestion.incorrect_answers];
                numAnswers = answerChoices.length;
                formattedQuestion.answer = Math.floor(Math.random() * numAnswers) + 1;
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

    getNewQuestion = () => {            
        explanation.innerHTML = ""; 
        explanation.classList.add('hidden'); 
        nextButton.classList.add('hidden'); 
        // if number of questions is maxed out, save score and end game
        if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
            localStorage.setItem('mostRecentScore', score);
            //console.log("mostRecentScore: " + score);
            //go to the end page
            return window.location.assign('end.html');
        }
        questionCounter++;
        progressText.innerHTML = `Question ${questionCounter}/${MAX_QUESTIONS}`;
        //Update the progress bar
        progressBarFull.style.width = `${((questionCounter / MAX_QUESTIONS) * 100)}%`;
        progressBarFull.style.height = '2.5rem';
        // Randomly choose one of the questions left in the list
        const questionIndex = Math.floor(Math.random() * availableQuestions.length);
        currentQuestion = availableQuestions[questionIndex];
            // Display the question
            //console.log("finally, I get this part!");
            question.innerHTML = currentQuestion.question;
            choices.forEach((choice) => {
                // randomize possible answers
                const number = choice.dataset['number'];
                // display the possible answers
                choice.innerHTML = currentQuestion['choice' + number];
            });
            // remove the question just displayed from the list
            availableQuestions.splice(questionIndex, 1);
            acceptingAnswers = true; 
    }; 
    // process answer choice click
    choices.forEach((choice) => {
        choice.addEventListener('click', (e) => {
            if (!acceptingAnswers) return;
            // answer was clicked on, don't allow any more clicks
            acceptingAnswers = false;
            // set variable for chosen answer
            const selectedChoice = e.target;
            // set variable for index of chosen answer
            const selectedAnswer = selectedChoice.dataset['number'];
            // set styling to chosen answer, either correct or incorrect
            const classToApply =
                selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
            // if answer is correct
            if (classToApply === 'correct') {
                // set last answer correct variable to true so it can be counted for consecutive bonus
                lastCorrect = true;
                // add this correct answer to consecutive total
                if (lastCorrect) { 
                    consecutiveCorrect ++;
                    // add points for correct answer
                    incrementScore(CORRECT_POINTS);                
                    // bonuses for consecutive correct answers!
                    // start feedback selection, show bonus text to give feedback when consecutive count is multiple of 4
                    switch (consecutiveCorrect > 0 && consecutiveCorrect % 4) {
                        case 0:
                            bonusText = "You did it!!!   You got the bonus!";      
                            incrementScore(CORRECT_BONUS * 50 * bonusesReached);
                            bonusesReached++;
                            break;
                        case 1:
                            bonusText = "Great start! <br>  Only 4 more to go for your next bonus!";
                            break;
                        case 2:
                            bonusText = "Keep going!   Only 3 more to go for your next bonus!";
                            break;
                        case 3:
                            bonusText = "You're getting there!  Only 2 more to go for your next bonus!";
                            break;
                        case 4:
                            bonusText = "You got this!   Only 1 more to go for your next bonus!";
                            break;
                        default:
                            bonusText = "You'll get that bonus yet!  Keep going!";
                            break;
                    } // end feedback switch            
                explanation.innerHTML = "";    
                }  //  end of if lastcorrect
            } else {  // if not correct  
                explanation.classList.remove('hidden');           
                explanation.innerHTML = "Explanation or correct answer: <br><br>" + currentQuestion.explanation;
                // set number of consecutive correct answers back to zero
                consecutiveCorrect = 0;
                // set last answer correct to false so it won't be counted for consecutive bonus
                lastCorrect = false;
            }
            if (consecutiveCorrect === 0) {
                bonusText = "Uh Oh, starting over...Don't give up, try again!";
            }
            bonus.innerHTML = bonusText;
            selectedChoice.parentElement.classList.add(classToApply);
            setTimeout(() => {
                // remove red or green color
                selectedChoice.parentElement.classList.remove(classToApply);
            }, 2000);
            console.log('DEBUG: LINE 201, nextButton.classList: '  + nextButton.classList);
            nextButton.classList.remove('hidden');       
        });
    });  // end 

    let incrementScore = (num) => {
        score += num;
        scoreText.innerHTML = '<div><table><tr><td>Total points: </td><td class="right points">' + score + '</tr><tr><td>Consecutive correct: </td><td class="right consec">' + consecutiveCorrect + '</tr><tr><td> Bonuses Received: </td><td class="right bonuses">' + bonusesReached + ' </td></tr></table></div>';
    };
};
