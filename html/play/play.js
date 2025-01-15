
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
          let p="players:[{user_UID:"+user_UID+",score_round':0}]";
          boardgamesService.addPlayers(boardgame_id, players);
        }else{
          let p="";
          for (i=0; i<players_old.length;i++){
            p = p+"{user_UID:"+players_old[0].user_UID+",score_round:"+players_old[0].score_round+"}";
          }
          let newplayer = "{user_UID:"+user_UID+",score_round:0}";
          const players = "players:["+p+newplayer+"]";
          console.log(players);
          boardgamesService.updatePlayer(boardgame_id, players);
        }
      }
      document.getElementById("play-form").reset();
    });
  });
});
