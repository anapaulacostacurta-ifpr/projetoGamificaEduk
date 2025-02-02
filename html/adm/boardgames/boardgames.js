var user_UID = sessionStorage.userUid;
var score_total = sessionStorage.score_total + " points";
var nameUser = sessionStorage.nameUser;


if(sessionStorage.boardgames === undefined){
  setBoardGames();
}
var boardgames = getBoardgames();

firebase.auth().onAuthStateChanged( (user) => {
  if (!user) {
    sessionStorage.clear;
    window.location.href = "../login/login.html";
  }
})

// Captura o evento de envio do formulário
document.getElementById("boardgame-form").addEventListener("submit", function(event) {
  event.preventDefault();
  if(boardgames === undefined){
    getBoardgames();
  }

  var alert_sucesso = document.getElementById("alert_sucesso");
  var alert_error = document.getElementById("alert_error");
  var msg_sucesso = document.getElementById("res_sucesso");
  var msg_error = document.getElementById("res_error");  

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
    msg_error.innerHTML="Rodada ID: "+ boardgameid + " está já esta cadastrado!"; 
    alert_error.fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
    //resetar("error");
  }else{
    //Inserir
    //saveBoardgame(newboardgame);
    msg_sucesso.innerHTML= "Consulte o cadastro da Rodada ID:"+ boardgameid;
    alert_sucesso.fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
    //resetar("sucesso");
  }
  
});

function resetar(tipo){
  if(tipo == "error"){
    var alert_sucesso = document.getElementById("alert_sucesso");
    var msg_sucesso = document.getElementById("res_sucesso");
    msg_sucesso.innerHTML="";
    alert_sucesso.classList.remove("show");
  }else{
    var alert_error = document.getElementById("alert_error");
    var msg_error = document.getElementById("res_error");
    msg_error.innerHTML="";
    alert_error.classList.remove("show");
  }
  document.getElementById("boardgame-form").reset();
}

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


function saveBoardgame(newboardgame){
  boardgamesService.save(newboardgame);
  setBoardGames();
}

function getBoardgamebyID(boardgameid,round_date, host, level){
  var existe = false;
  if(boardgames === undefined){
    getBoardgames();
  }
  boardgames.forEach(boardgame =>{
    if(boardgame.boardgameid == boardgameid){
      if(boardgame.round_date == round_date){
        if(boardgame.host == host){
          if(boardgame.level == level){a
            if(boardgame.state !== "finished"){
              existe = true;
            }
          }
        }
      }
    }
  });
  return existe;
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
  boardgamestring = sessionStorage.boardgames;
  if (!(boardgamestring === undefined)){
    boardgames = JSON.parse(boardgamestring);
  }
  return boardgames;
}
  