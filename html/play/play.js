
// Captura o evento de envio do formulário
document.getElementById("play-form").addEventListener("submit", function(event) {
  event.preventDefault();

  // Captura os dados do formulário
  const boardgame_id = document.getElementById("boardgameid").value;
  const player = document.getElementById("userUid").value;
  
  boardgamesService.getBoardGameByID(boardgame_id).then((boardgames) => {
    boardgames.forEach(boardgame => {
      console.log(boardgames);
      const state  = boardgame.state;
      const players = boardgame.players;
      if(state != "started"){
        alert('Tabuleiro Não disponível ainda. Fale com o professor!');
      }else{
        if(players.empty){
          alert(players);
        }else{
          alert(players);
        }
      }
        //players.forEach(player => {
          /**[
            useruid,
            answer[
              questionuid
              optionselected
              timeanswer
              scorequestion
            ],
            scoreround,		
          ]**/
          //if (player.uid.)
        })

      
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
 
      }).catch(error => {
        alert(error);
      })
    }
  )
