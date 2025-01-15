
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
      const players = boardgame.players;
      if(state != "started"){
        alert('Tabuleiro Não disponível ainda. Fale com o professor!');
      }else{
        if (players === undefined){
          const player = {'user_UID':user_UID,'score_round':0};
          const players = player.split(",").map(players => players.trim());
          // Chama a função para atualizar no Firestore
          boardgamesService.addPlayers(boardgame_id, players);
        }else{
          alert(players);
          const i = players.length;
          const player = {'user_UID':user_UID,'score_round':0};
          boardgamesService.updatePlayer(boardgame_id, player);
        }
      }
      document.getElementById("play-form").reset();
    });
  });
});
