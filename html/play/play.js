
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
      if(state != "started"){
        alert('Tabuleiro Não disponível ainda. Fale com o professor!');
      }else{
        if (players_old === undefined){
          const players = {'players.user_UID':user_UID,'players.score_round':0};
          boardgamesService.addPlayers(boardgame_id, players);
        }else{
          let p;
          for (i=0; i<players_old.length;i++){
            p = p+"players.user_UID:"+i[0].user_UID+"players.score_round:"+i[0].score_round;
          }
          let newplayer = "players.user_UID:"+user_UID+"players.score_round:0";
          const player = p+newplayer;
          players.split(",").map(players => players.trim());
          console.log(players);
          boardgamesService.updatePlayer(boardgame_id, players);
        }
      }
      document.getElementById("play-form").reset();
    });
  });
});
