const boardgame = getBoardgame();

//Ranking Nível
const scoreLevelPoint = document.getElementById("score_round");
scoreLevelPoint.innerHTML = "Level Score: "+sessionStorage.score_round;

const level = document.getElementById("level");
level.innerHTML = "Nível: "+sessionStorage.level;

//Ranking Geral
const scorePoint = document.getElementById("score_total");
scorePoint.innerHTML = "Score Total: "+sessionStorage.score_total;

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

function token() {
  window.location.href = "../quiz/token/token.html";
}

function getBoardgame(){
  let boardgameString = sessionStorage.boardgame;
  let boardgame = JSON.parse(boardgameString);
  console.log(boardgame);
  return boardgame;
}

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
    sessionStorage.clear();
    window.location.href = "../home/home.html";
  }
}
        