var user_UID = sessionStorage.userUid;
var score_total = sessionStorage.score_total + " points";
var nameUser = sessionStorage.nameUser;

var alert_sucesso = document.getElementById("alert_sucesso");
var msg_sucesso = document.getElementById("res_sucesso");
alert_sucesso.style.display = "none";
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

  boardgamesService.getBoardGameByID(boardgameid, round_date, host, level).then(boardgames =>{
    boardgames.forEach(boardgame => {
      msg_sucesso.innerHTML= "Rodada ID: "+ boardgame.boardgameid + " está com status: " + boardgame.state + "!"; 
      alert_sucesso.style.display = "inline";
      error = true;    
    })
  });

  if(!error){
    // Chama a função para salvar o quiz no Firestore
    boardgamesService.save(newboardgame);
    boardgamesService.getBoardGameByID(boardgameid, round_date, host, level, state).then(boardgames =>{
      boardgames.forEach(boardgame => {
        msg_sucesso.innerHTML= "Cadastro realizado com sucesso da Rodada ID:"+ boardgame.boardgameid; 
        alert_sucesso.style.display = "inline";   
      })
    });
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

  