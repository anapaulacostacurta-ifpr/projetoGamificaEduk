firebase.auth().onAuthStateChanged( (user) => {
  if (!user) {
      sessionStorage.clear;
      window.location.href = "../login/login.html";
  }
})
var user_UID = sessionStorage.userUid;
var User = getUser();
getProfile();

const boardgame = getBoardgame();



function logout() {
  firebase.auth().signOut().then(() => {
      sessionStorage.clear();
      window.location.href = "../../index.html";
  }).catch(() => {
      alert('Erro ao fazer logout');
  })
}

function sair(){
  if (window.confirm("Você irá perder todo o histórico desta rodada! Tem certeza que deseja sair?")) {
    window.location.href = "../home/home.html";
  }
}

function getBoardgame(){
  let boardgameString = sessionStorage.boardgame;
  let boardgame = JSON.parse(boardgameString);
  console.log(boardgame);
  return boardgame;
}

function quiz() {
  sessionStorage.setItem("question_category","quiz");
  window.location.href = "../question/token/token.html";
}
let hasquiz;
if (sessionStorage.hasquiz === undefined) {
   sessionStorage.setItem("hasquiz",true);
}else{
  if(sessionStorage.hasquiz == "true"){
    hasquiz = true;
  }else{
    hasquiz = false;
  }
}

if(!hasquiz){
  //Não tem mais Quiz para apresentar desativa o botão
   document.getElementById("AppQuiz").disabled = true;
}



function desafio() {
  sessionStorage.setItem("question_category","challange");
  window.location.href = "../question/token/token.html";
}

let haschallange;
if (sessionStorage.haschallange === undefined) {
  sessionStorage.setItem("haschallange",true);
}else{
  if(sessionStorage.haschallange == "true"){
    haschallange = true;
  }else{
    haschallange = false;
  }
}

if(!haschallange){
  //Não tem mais Quiz para apresentar desativa o botão
  document.getElementById("AppDesafio").disabled = true;
}


function sorte() {
  sessionStorage.setItem("question_category","luck");
  window.location.href = "../question/token/token.html";
}

let hasluck;
if (sessionStorage.hasluck === undefined) {
  sessionStorage.setItem("hasluck",true);
}else{
  if(sessionStorage.hasluck == "true"){
    hasluck = true;
  }else{
    hasluck = false;
  }
}

if(!hasluck){
  //Não tem mais Quiz para apresentar desativa o botão
  document.getElementById("AppSorte").disabled = true;
}

function extra(){
  window.location.href = "../extra/extra.html";
}

function quizfinal(){
  sessionStorage.setItem("question_category","quiz_final");
  window.location.href = "../question/token/token.html";
}

function getUser(){
  let UserString = sessionStorage.User;
  let User = JSON.parse(UserString);
  console.log(User);
  return User;
}

function getProfile(){
  if(User === undefined){
      User = getUser();
  }
  document.getElementById("nameUser").innerHTML = User.nickname;
  var avatar = User.avatar;
  document.getElementById("avatarUser").innerHTML ='<img class="img-fluid rounded-circle img-thumbnail" src="../../assets/img/perfil/'+avatar+'.png" width="50" height="50"></img>';
  document.getElementById("score_total").innerHTML = User.score;
  document.getElementById("score_round").innerHTML = sessionStorage.score_round;
  document.getElementById("level").innerHTML = sessionStorage.level;
}