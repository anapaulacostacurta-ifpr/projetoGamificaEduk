
// Captura o evento de envio do formulário
document.getElementById("play-form").addEventListener("submit", function(event) {
  event.preventDefault();

  // Captura os dados do formulário
  const boardgame_id = document.getElementById("boardgameid").value;
  const user_UID = document.getElementById("userUid").value;
  
  boardgamesService.getBoardGameByID(boardgame_id).then((boardgames) => {
    boardgames.forEach(boardgame => {
      console.log(boardgames);
      const state  = boardgame.state;
      var players = boardgame.players;
         
      if(state != "started"){
        alert('Tabuleiro Não disponível ainda. Fale com o professor!');
      }else{
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
            }
          });
          if (isOnPlayer){
            alert('Você já entrou no jogo!Fale com o professor!');
          }else{
            players.push({user_UID:user_UID,score_round:0});
            boardgamesService.addPlayers(boardgame_id, {players});
          }
        }
      }
      });
      document.getElementById("play-form").reset();
    });
  });
