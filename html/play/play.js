//Ranking Geral
const scorePoint = document.getElementById("score_total");
scorePoint.innerHTML = "Score Total: "+sessionStorage.getItem("score_total");


// Captura o evento de envio do formulário
document.getElementById("play-form").addEventListener("submit", function(event) {
  event.preventDefault();

  // Captura os dados do formulário
  const boardgame_id = document.getElementById("boardgameid").value;
  const user_UID = sessionStorage.userUid;
  
  boardgamesService.getBoardGameByID(boardgame_id).then((boardgames) => {
    boardgames.forEach(boardgame => {
      console.log(boardgames);
      const state  = boardgame.state;
      var players = boardgame.players;
      
        let score = 0;
        if (players === undefined){
          players = new Array();
          players[0] = {user_UID:user_UID,score_round:0};
          boardgamesService.addPlayers(boardgame_id, {players});
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
        sessionStorage.setItem("boardgame_id",boardgame_id);
        sessionStorage.setItem("level",boardgame.level);
        sessionStorage.setItem("score_round",score);
      });
      window.location.href = "./menu.html";
    }).catch( (error) => {
      console.log (error);
      document.getElementById("play-form").reset();
    })
  });
  
function logout() {
    firebase.auth().signOut().then(() => {
        sessionStorage.clear();
        window.location.href = "../../index.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}