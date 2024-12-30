
// Captura o evento de envio do formulário
document.getElementById("play-form").addEventListener("submit", function(event) {
  event.preventDefault();

  // Captura os dados do formulário
  const boardgameid = document.getElementById("boardgameid").value;
  const player = document.getElementById("userUid").value.split(",").map(players => players.trim());
  const players = new Array(player);
  
  boardgamesService.findByUid(boardgameid).then( (boardgames) => {
    console.log(boardgames);
    const round_date = boardgames.round_date;
    const level = boardgames.level;
    const host = boardgames.host;
    const boardgameid = boardgames.boardgameid;
    const state  = boardgames.state;

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