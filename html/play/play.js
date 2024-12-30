
// Captura o evento de envio do formulário
document.getElementById("play-form").addEventListener("submit", function(event) {
  event.preventDefault();

  // Captura os dados do formulário
  const boardgameid = document.getElementById("boardgameid").value;
  const players = document.getElementById("userUid").value.slip(",").map(player => player.trim());
  
  boardgamesService.getBoardGameByID(boardgameid).then((boardgames) => {
    boardgames.forEach(boardgame => {
      console.log(boardgames);
      const round_date = boardgame.round_date;
      const level = boardgame.level;
      const host = boardgame.host;
      const boardgameid = boardgame.boardgameid;
      const state  = boardgame.state;
  
      if(state != "started"){
        alert('Tabuleiro Não disponível ainda. Fale com o professor!');
      }else{
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
    }).catch(error => {
      alert(error);
    });
  });     

});
 