var index = 0;
var score = 0;
var arr = null;
let timer = 60;
var highscores = [];
// if the localStorage has highscores stored previous use that as initial value
if (localStorage.getItem("highscores") != null) {
    highscores = JSON.parse(localStorage.getItem("highscores"));
}

function startQuiz() {
$("#question-container").css("display", "initial");
$.ajax({
    'async': false,
    'global': false,
    'url': "./questions.json",
    'dataType': "json",
    'success': function (data) {
        arr = data;
    }
});
loadQuestion(arr);

    $("#clock").prop("innerText", "Time Remaining :" + timer)
    
//runs the timer
const run_timer = () => {
    timer = timer - 1;
    if (timer <= 0) {
        clearInterval(timerInterval);
        gameOver();
    }
    $("#clock").prop("innerText","Time Remaining :" + timer) 
}
const timerInterval=setInterval(() => {
    run_timer();
}, 1000);

// allows user to choose only one option
$(".input-button").on("change", function () {
    $(".option").removeClass("selected");
    $(this).parent().addClass("selected");
    $(".input-button").not(this).prop("checked", false);
    
})

}
//load a question from json object
function loadQuestion(arr) {
    $(".input-button").prop("checked", false);
    $(".option").removeClass("selected");
    $(".option").removeClass("correct");
    $(".option").removeClass("wrong");
    if (index == arr.length) {
        gameOver();
    }
    $("#question-text").prop("innerText", arr[index].question);
    $("#A").prop("innerHTML", arr[index].options.A);
    $("#B").prop("innerText", arr[index].options.B);
    $("#C").prop("innerText", arr[index].options.C);
    $("#D").prop("innerText", arr[index].options.D);
}




// check the answer and load the next question
function checkAnswer() {
    $(".input-button").toArray().forEach((option)=> {
        if (option.checked) {
            if (option.value == arr[index].correct) {
                option.parentNode.classList.add("correct");
                score = score + 1;
            }
            else {
                option.parentNode.classList.add("wrong");
                timer = timer - 10; // 10 seconds penalty for wrong answer
            }
            index = index + 1;
            setTimeout(() => {
                loadQuestion(arr);
            },1000);
        }
    });
}

//handler for start button
function handleStart() {
    $("#start").css("display", "none");
    $("#question-container").css("display", "initial");
    startQuiz();
}

// triggers gameover screen
function gameOver() {
    $("#question-container").css("display", "none");
    $("#game-over").css("display", "initial");
    $("#score").prop("innerText", "Score: "+ score);
}


//saves the score in the local storage
function saveScore() {
    const name = $("#name").val();
    highscores.push({ "name": name, "score": score });
    localStorage.setItem("highscores", JSON.stringify(highscores));
    window.location.reload();
}


//handles view highscore button and shows the highscore page
function showHighScores() {
    $(".primary-text").css("opacity", "0");
    let i = 1;
    const scorelist=JSON.parse(localStorage.getItem("highscores"));
    $("#start,#question-container,#game-over").css("display", "none");
    $("#highscores").css("display", "initial");
    scorelist.forEach((score) => {
        $("#score-container").append("<tr><td>"+i+"</td><td>"+score.name+"</td><td>"+score.score+"</td></tr>")
        i++;
    });
}