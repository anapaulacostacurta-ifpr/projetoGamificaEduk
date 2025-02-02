var user_UID = sessionStorage.userUid;
var score_total = sessionStorage.score_total + " points";
var nameUser = sessionStorage.nameUser;

var alert_sucesso = document.getElementById("alert_sucesso");
var alert_error = document.getElementById("alert_error");
var msg_sucesso = document.getElementById("res_sucesso");
var msg_error = document.getElementById("res_error");
var error = false;   


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
  /** Deverá ser controlada a log das respostas 
  answer[
    questionuid
    optionselected
    timeanswer
    scorequestion
  ],
  **/
  const state = "waiting"; // "waiting", "started", "finished"

  // Cria o objeto para salvar o quiz
  const newboardgame = {
    round_date,
    boardgameid,
    level,
    host,
    state,  
  };

  var msg_txt = '';
  boardgamesService.getBoardgameRounds(boardgameid, round_date, host, level).then(boardgames =>{
    boardgames.forEach(boardgame => {
      if(boardgame.state !== "finished"){
        alert(boardgame.boardgameid);
        msg_txt= msg_txt + "Rodada ID: "+ boardgame.boardgameid + " está com status: " + boardgame.state + "!"; 
        error = true;
      } 
    })
  });

  if(!error){
    // Chama a função para salvar o quiz no Firestore
    //boardgamesService.save(newboardgame);
    msg_sucesso.innerHTML= "Consulte o cadastro da Rodada ID:"+ boardgameid;
    alert_sucesso.classList.add("show");
    
  }else{
    msg_error.innerHTML= msg_txt;
    alert_error.classList.add("show");
    error = true; 
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

  