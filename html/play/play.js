
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
      const players_old = boardgame.players;
      console.log(players_old);
      if(state != "started"){
        alert('Tabuleiro Não disponível ainda. Fale com o professor!');
      }else{
        if (players_old === undefined){
          const players = {players:{0:{user_UID:user_UID,score_round:0}}};
          boardgamesService.addPlayers(boardgame_id, players);
        }else{
          const i = players_old.length;
          const players = {players:{i:{user_UID:user_UID,score_round:0}}};
          boardgamesService.addPlayers(boardgame_id, players);
        }
      }
      })
      document.getElementById("play-form").reset();
    });
  });
