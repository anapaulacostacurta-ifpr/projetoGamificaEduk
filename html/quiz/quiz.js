const quiz_box = document.querySelector(".quiz_box");
const que_text = document.querySelector(".que_text");
const option_list = document.querySelector(".option_list");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");

//Ranking Nível
const scoreLevelPoint = document.getElementById("score_round");
scoreLevelPoint.innerHTML = "Level Score: "+sessionStorage.score_round;

const level = document.getElementById("level");
level.innerHTML = "Nível: "+sessionStorage.level;

//Ranking Geral
const scorePoint = document.getElementById("score_total");
scorePoint.innerHTML = "Score Total: "+sessionStorage.score_total;

questionsService.getQuizzesByLevel(parseInt(sessionStorage.level),"quiz").then(questions =>{
  questions.forEach(question => {
    setAtualQuestion(question);
  });
});

const boardgame = getBoardgame();

const question = getAtualQuestion();
showQuestion();
startTimer(15);

function setAtualQuestion(question){
  // Convert the user object into a string
  let questionString = JSON.stringify(question);
  // Store the stringified object in sessionStorage
  sessionStorage.setItem('question', questionString);
  return questionString;
}

function getAtualQuestion(){
  // Get the stringified object from sessionStorage
  let questionString = sessionStorage.question;
    // Parse the string back into an object
  let question = JSON.parse(questionString);
  console.log(question);
  return question;
}

function getBoardgame(){
  let boardgameString = sessionStorage.boardgame;
  let boardgame = JSON.parse(boardgameString);
  console.log(boardgame);
  return boardgame;
}

function showQuestion(){
  //creating a new span and div tag for question and option and passing the value using array index
  let que_tag = "<span>" +  question.numb +".</span>"+"<span>" +  question.text +"</span>";
  let option_tag = 
  '<div class="option"><p class="choice-prefix">A</p><p class="choice-text" data-number="1"><span class="question">' +
    question.options[0] +
    "</span></div>" +
    '<div class="option"><p class="choice-prefix">B</p><p class="choice-text" data-number="2"><span class="question">' +
    question.options[1] +
    "</span></p></div>" +
    '<div class="option"><p class="choice-prefix">C</p><p class="choice-text" data-number="3"><span class="question">' +
    question.options[2] +
    "</span></p></div>" +
    '<div class="option"><p class="choice-prefix">D</p><p class="choice-text" data-number="4"><span class="question">' +
    question.options[3] +
    "</span></p></div>";
  
  que_text.innerHTML = que_tag; //adding new span tag inside que_tag
  option_list.innerHTML = option_tag; //adding new div tag inside option_tag

  const option = option_list.querySelectorAll(".option");
  // set onclick attribute to all available options
  for (i = 0; i < option.length; i++) {
    option[i].setAttribute("onclick", "optionSelected(this)");
  }
}

// creating the new div tags which for icons
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

//if user clicked on option
function optionSelected(answer) {
  let userAns = answer.querySelector(".choice-text").textContent; //getting user selected option
  let correcAns =  question.answer[0];   
  const allOptions = option_list.children.length; //getting all option items
  sessionStorage.setItem("userAnswer",userAns);

  if (userAns == correcAns) {
    answer.classList.add("correct"); //adding green color to correct selected option
    answer.insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to correct selected option
  } else {
    answer.classList.add("incorrect"); //adding red color to correct selected option
    answer.insertAdjacentHTML("beforeend", crossIconTag); //adding cross icon to correct selected option
    console.log("Wrong Answer");

    for (i = 0; i < allOptions; i++) {
      if (option_list.children[i].textContent == correcAns) {
        //if there is an option which is matched to an array answer
        option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
        option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
        console.log("Auto selected correct answer.");
      }
    }
  }
  for (i = 0; i < allOptions; i++) {
    option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
  }
}

document.getElementById("quiz-form").addEventListener("submit", function(event) {
  event.preventDefault();
  const user_UID = sessionStorage.userUid;
  const boardgame_id = boardgame.boardgameid;
  const level = boardgame.level;
  const data = (new Date()).toLocaleDateString('pt-BR');
  var log_answers = new Array ();
  log_answers = getUserAnswers(user_UID);
  const log = {data: data, level: level, boardgame_id: boardgame_id, category: question.type, question_numb:question.numb, user_answer:sessionStorage.userAnswer, tokenid: sessionStorage.token};
  log_answers.push(log);
  // Salvar no banco de dados.
  var res = logboardgamesService.save(user_UID, {log_answers});
  window.location.href = "../play/menu.html";
});

function getUserAnswers(user_UID){
  var log_answers = []
  logboardgamesService.getlogboardgameByUserUID(user_UID).then(logboardgames => {
    logboardgames.forEach(logboardgame => {
      log_answers = logboardgame.log_answers;
      if (log_answers === undefined){
        log_answers = []; 
      }
    });  
  }); 
  return log_answers;
}

function startTimer(time) {
  counter = setInterval(timer, 1000);
  function timer() {
    timeCount.textContent = time; //changing the value of timeCount with time value
    time--; //decrement the time value
    if (time < 9) {
      //if timer is less than 9
      let addZero = timeCount.textContent;
      timeCount.textContent = "0" + addZero; //add a 0 before time value
    }
    if (time < 0) {
      //if timer is less than 0
      clearInterval(counter); //clear counter
      timeText.textContent = "Intervalo"; //change the time text to time off
      const allOptions = option_list.children.length; //getting all option items
      let correcAns =  question.answer; //getting correct answer from array
      for (i = 0; i < allOptions; i++) {
        if (option_list.children[i].textContent == correcAns) {
          //if there is an option which is matched to an array answer
          option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
          option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
          console.log("Time Off: Auto selected correct answer.");
        }
      }
      for (i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
      }
    }
  }
}

function startTimerLine(time) {
  counterLine = setInterval(timer, 29);
  function timer() {
    time += 1; //upgrading time value with 1
    time_line.style.width = time + "px"; //increasing width of time_line with px by time value
    if (time > 549) {
      //if time value is greater than 549
      clearInterval(counterLine); //clear counterLine
    }
  }
}

function logout() {
  firebase.auth().signOut().then(() => {
      sessionStorage.clear();
      window.location.href = "../../index.html";
  }).catch(() => {
      alert('Erro ao fazer logout');
  })
}