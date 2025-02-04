firebase.auth().onAuthStateChanged( (user) => {
  if (!user) {
      sessionStorage.clear;
      window.location.href = "../login/login.html";
  }
})

var user_UID = sessionStorage.userUid;
var User = getUser();
getProfile();

// Captura o evento de envio do formulário
document.getElementById("play-form").addEventListener("submit", function(event) {
  event.preventDefault();

  // Captura os dados do formulário
  const rodada_id = document.getElementById("boardgameid").value;
  
  boardgamesService.getBoardGameByRodadaID(rodada_id).then((boardgames) => {
    boardgames.forEach(boardgame => {
        let boardgameid = boardgame.dados.boardgameid;
        if(boardgameid == rodada_id){
          setBoardGame(boardgame);
          var players = boardgame.dados.players;
            let score = 0;
            if (players === undefined){
              players = new Array();
              players[0] = {user_UID:user_UID,score_round:0};
              boardgamesService.addPlayers(boardgameid, {players});
            }else{
              //variável para verficar se o jogador já entrou no tabuleiro
              let isOnPlayer = false;
              
              players.forEach(player => {
                if(player.user_UID == user_UID){
                  isOnPlayer = true;
                  score = player.score_round;
                }
              });
              if (isOnPlayer){
                alert('Você já entrou no jogo!Fale com o professor!');
              }else{
                players.push({user_UID:user_UID,score_round:0});
                boardgamesService.addPlayers(boardgame_id, {players});
              }
            }
            setBoardGame(boardgame);
            sessionStorage.setItem("boardgameid",boardgameid);
            sessionStorage.setItem("rodadaid",rodada_id);
            sessionStorage.setItem("level",boardgame.level);
            sessionStorage.setItem("score_round",score);
        }
      });
      window.location.href = "./menu.html";
    }).catch( (error) => {
      alert(error);
      document.getElementById("play-form").reset();
    })
  });

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

function voltar(){
  window.location.href = "../home/home.html";
}

function logout() {
    firebase.auth().signOut().then(() => {
        sessionStorage.clear();
        window.location.href = "../login/login.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
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
  document.getElementById("nameUser").innerHTML = User.name;
  document.getElementById("score_total").innerHTML = User.score +" points";
}