const quiz_box = document.querySelector(".quiz_box");
const que_text = document.querySelector(".que_text");
const option_list = document.querySelector(".option_list");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");
const user_UID = sessionStorage.userUid;
let hasQuiz = true; 

//Ranking Nível
const scoreLevelPoint = document.getElementById("score_round");
scoreLevelPoint.innerHTML = "Level Score: "+sessionStorage.score_round;

const level = document.getElementById("level");
level.innerHTML = "Nível: "+sessionStorage.level;

//Ranking Geral
const scorePoint = document.getElementById("score_total");
scorePoint.innerHTML = "Score Total: "+sessionStorage.score_total;

//Buscar questões e colocar na sessão;
var quizzes = getQuizzes();

const boardgame = getBoardgame();

const quiz = getAtualQuiz();
if(hasQuiz){
  showQuiz();
  startTimer(15);
}else{
  sessionStorage.setItem('hasquiz',false);
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('quiz');
  window.location.href = "../play/menu.html";
}


function getQuizzes(){
  var quizzesString = sessionStorage.quizzes;
  var quizzes;
  if (quizzesString  === undefined){
    questionsService.getQuizzesByLevel(parseInt(sessionStorage.level),"quiz").then(questions =>{
      console.log(questions);
      hasQuiz = true;
      setQuizzes(questions);
    });
  }else{
    quizzes = JSON.parse(quizzesString);
    console.log(quizzes);
  }
  return quizzes;
}

function setQuizzes(questions){
    // Convert the user object into a string
    let quizzesString = JSON.stringify(questions);
    // Store the stringified object in sessionStorage
    sessionStorage.setItem('quizzes', quizzesString);
    sessionStorage.setItem('answered_quizzes', JSON.stringify(new Array()));
}

function getAnsweredQuizzes(){
  // Get the stringified object from sessionStorage
  let answered_quizzesString = sessionStorage.answered_quizzes;
    // Parse the string back into an object
  let answered_quizzes = JSON.parse(answered_quizzesString);
  console.log(answered_quizzes);
  return answered_quizzes;
}


function setAtualQuiz(){
  let answered_quizzes = getAnsweredQuizzes();
  let quizString;
  //buscar as questões da sessão
  quizzes.forEach(quiz => {
    if(answered_quizzes.indexOf(quiz.numb) == -1){ //Não foi respondida
      quizString = JSON.stringify(quiz);
    }
  });
  //Coloca quiz atual na sessão.
  if(quizString === undefined){
    hasQuiz = false;
  }else {
    sessionStorage.setItem('quiz', quizString);
    return quizString;
  }
}

function getAtualQuiz(){
  let quizString = sessionStorage.quiz;
  let quiz;
  if (quizString === undefined){
    quizString = setAtualQuiz();
  }
  quiz = JSON.parse(quizString);
  console.log(quiz);
  return quiz;
}


function getBoardgame(){
  let boardgameString = sessionStorage.boardgame;
  let boardgame = JSON.parse(boardgameString);
  console.log(boardgame);
  return boardgame;
}

function showQuiz(){
  //creating a new span and div tag for question and option and passing the value using array index
  let que_tag = "<span>" +  quiz.numb +".</span>"+"<span>" +  quiz.text +"</span>";
  let option_tag = 
  '<div class="option"><p class="choice-prefix">A</p><p class="choice-text" data-number="1"><span class="question">' +
    quiz.options[0] +
    "</span></div>" +
    '<div class="option"><p class="choice-prefix">B</p><p class="choice-text" data-number="2"><span class="question">' +
    quiz.options[1] +
    "</span></p></div>" +
    '<div class="option"><p class="choice-prefix">C</p><p class="choice-text" data-number="3"><span class="question">' +
    quiz.options[2] +
    "</span></p></div>" +
    '<div class="option"><p class="choice-prefix">D</p><p class="choice-text" data-number="4"><span class="question">' +
    quiz.options[3] +
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
  let correcAns =  quiz.answer[0];   
  const allOptions = option_list.children.length; //getting all option items
  sessionStorage.setItem("userAnswer",userAns);

  if (userAns == correcAns) {
    answer.classList.add("correct"); //adding green color to correct selected option
    answer.insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to correct selected option
    setScore(true);
  } else {
    answer.classList.add("incorrect"); //adding red color to correct selected option
    answer.insertAdjacentHTML("beforeend", crossIconTag); //adding cross icon to correct selected option
    console.log("Wrong Answer");
    setScore(false);
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
  //limpar token da sessão e quiz atual 
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('quiz');
  window.location.href = "../play/menu.html";
});


function setScore(corret){
  var boardgame = getBoardgame();
  var players = boardgame.players;
  var count = 0;
  let score_old = parseInt(sessionStorage.score_round);
  let score;
  players.forEach(player => {
    if(player.user_UID == user_UID){
      if (corret){
        score = score_old + 10;
        count ++;
      }else{
        score = score_old - 5;
        count ++;
      }
      return [];
    }
  });
  count = count -1;
  
  //Salvar Score na variável
  players[count].score_round = score;
  //Atualizar no banco de dados
  boardgamesService.addPlayers(boardgame.boardgameid, {players});
  //Atualizar Sessão
  sessionStorage.setItem("score_round",score);

  //Atualizar Quiz respondido na sessão
  let answered_quizzes = getAnsweredQuizzes();
  answered_quizzes.push(quiz.numb);
  sessionStorage.setItem('answered_quizzes', JSON.stringify(answered_quizzes));

  //Log da resposta
  const boardgame_id = boardgame.boardgameid;
  const level = boardgame.level;
  const hora = (new Date()).toLocaleTimeString('pt-BR');
  const data = (new Date()).toLocaleDateString('pt-BR');
  var log_answers = {user_UID: user_UID, data: data, hora: hora, level: level, boardgame_id: boardgame_id, category: quiz.type, quiz_numb:quiz.numb, user_answer:sessionStorage.userAnswer, score_old: score_old, score_round: score, tokenid: sessionStorage.token};
  // Salvar no banco de dados.
  saveLogAnswers(log_answers);
  
}

function saveLogAnswers(log_answers){
  logboardgamesService.save(log_answers);
}

function setBoardGame(boardgame){
  let boardgameString = JSON.stringify(boardgame);
  sessionStorage.setItem('boardgame', boardgameString);
}

function getBoardgame(){
  let boardgameString = sessionStorage.boardgame;
  let boardgame = JSON.parse(boardgameString);
  console.log(boardgame);
  return boardgame;
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
      let correcAns =  quiz.answer; //getting correct answer from array
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