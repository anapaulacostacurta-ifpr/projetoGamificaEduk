
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
      const  players_old = boardgame.players;
      let i = 0;
      for (const element of (players_old)) {
        i++;
      }
      if(state != "started"){
        alert('Tabuleiro Não disponível ainda. Fale com o professor!');
      }else{
        const players = {players:{i:{user_UID:user_UID,score_round:0}}};
        boardgamesService.addPlayers(boardgame_id, players);
      }
      })
      document.getElementById("play-form").reset();
    });
  });
