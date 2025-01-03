
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
        if (players != null){
          const i = players.length;
          const player = {'user_UID':user_UID,'score_round':0};
          boardgamesService.updatePlayer(boardgame_id, player);
        }else{
          alert(players);
        //
          /**[
          players =>{
            useruid: userUID,
            answer: {
              questionuid :
              optionselected : {}
              timeanswer : 1,
              scorequestion : 1,
            },
            scoreround: ,		
          }**/
          
        
          const updateboardgame = {
            round_date,
            boardgameid,
            level,
            host,
            state, 
            players,
          };
          // Chama a função para atualizar no Firestore
          boardgamesService.update(updateboardgame);
    
          // Limpa o formulário após o envio
          document.getElementById("play-form").reset();
        }
      }
    });
  });
});
