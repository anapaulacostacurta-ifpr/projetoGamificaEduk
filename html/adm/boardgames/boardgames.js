var user_UID = sessionStorage.userUid;
var score_total = sessionStorage.score_total + " points";
var nameUser = sessionStorage.nameUser;

var alert_sucesso = document.getElementById("alert_sucesso");
var alert_error = document.getElementById("alert_error");
var msg_sucesso = document.getElementById("res_sucesso");
var msg_error = document.getElementById("res_error");  


if(sessionStorage.boardgames === undefined){
  setBoardGames();
  setTimeout(console.log("Aguardando finalizar a consulta!!"), 2000);
}
const boardgames = getBoardgames();

firebase.auth().onAuthStateChanged( (user) => {
  if (!user) {
    sessionStorage.clear;
    window.location.href = "../login/login.html";
  }
})

// Captura o evento de envio do formulário
document.getElementById("boardgame-form").addEventListener("submit", function(event) {
  event.preventDefault();

  // Captura os dados do formulário
  const round_date = (new Date()).toLocaleDateString('pt-BR');
  const level = document.getElementById("level").value;
  const host = sessionStorage.userUid;
  const boardgameid = document.getElementById("boardgameid").value;
  const state = "waiting"; // "waiting", "started", "finished"

  // Cria o objeto para salvar o quiz
  const newboardgame = {
    round_date,
    boardgameid,
    level,
    host,
    state,  
  };

  if(getBoardgamebyID(boardgameid,round_date, host, level)){
    msg_error.innerHTML="Rodada ID: "+ boardgame.boardgameid + " está com status: " + boardgame.state + "!"; 
    alert_error.classList.add("show");
  }else{
    //Inserir
    //boardgamesService.save(newboardgame);
    msg_sucesso.innerHTML= "Consulte o cadastro da Rodada ID:"+ boardgameid;
    alert_sucesso.classList.add("show");
  }
});

function logout() {
  firebase.auth().signOut().then(() => {
      sessionStorage.clear();
      window.location.href = "../../index.html";
  }).catch(() => {
      alert('Erro ao fazer logout');
  })
}

function voltar(){
  window.location.href = "../../home/home.html";
}


function buscarBordgames(){
boardgamesService.getBoardGameByID(boardgameid, round_date, host, level);
  if(boardgames == undefined){
    boardgames.array.forEach(boardgames => {
      
    });
  } 
}

function getBoardgamebyID(boardgameid,round_date, host, level){
  boardgames.forEach(boardgame =>{
    if(boardgame.boardgameid == boardgameid){
      if(boardgame.round_date == round_date){
        if(boardgame.host == host){
          if(boardgame.level == level){
            if(boardgame.state !== "finished"){
              return true;
            }
          }
        }
      }
    }
  });
  return false;
}

function setBoardGames(){
  boardgamesService.findAll().then(boardgames =>{
      let boardgamesString = JSON.stringify(boardgames);
      sessionStorage.setItem('boardgames', boardgamesString);
    });
  
}

function getBoardgames(){
  let boardgamestring;
  let boardgames;
  if(sessionStorage.boardgames === undefined){
    setBoardGames();
  }else{
    boardgamestring = sessionStorage.boardgames;
    boardgames = JSON.parse(boardgamestring);
  }
    console.log(boardgames);
    return boardgames;
}
  