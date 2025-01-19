
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
      var player = boardgame.players;
         
      if(state != "started"){
        alert('Tabuleiro Não disponível ainda. Fale com o professor!');
      }else{
        if (player === undefined){
          player = new Array();
          player[0] = {user_UID:user_UID,score_round:0};
        }else{
          player.push({user_UID:user_UID,score_round:0});
        }
        const players = {players:{player}};
        boardgamesService.addPlayers(boardgame_id, players);
      }
      })
      document.getElementById("play-form").reset();
    });
  });
