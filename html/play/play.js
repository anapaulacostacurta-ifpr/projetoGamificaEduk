
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
          const players = {'players.user_UID':user_UID,'players.score_round':0};
          boardgamesService.addPlayers(boardgame_id, players);
        }else{
          let p;
          boardgame.players.forEach(players => {
            p = p+"players.user_UID:"+players.user_UID+"players.score_round:"+players.score_round;
          })
          let newplayer = "players.user_UID:"+user_UID+"players.score_round:0";
          const players = p+newplayer;
          players.split(",").map(players => players.trim());
          boardgamesService.updatePlayer(boardgame_id, players);
        }
      }
      document.getElementById("play-form").reset();
    });
  });
});
