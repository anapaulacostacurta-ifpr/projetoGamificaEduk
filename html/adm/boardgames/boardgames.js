
// Captura o evento de envio do formulário
document.getElementById("boardgame-form").addEventListener("submit", function(event) {
  event.preventDefault();

  // Captura os dados do formulário
  const round_date = document.getElementById("round_date").value;
  const level = document.getElementById("level").value;
  const host = document.getElementById("userUid").value;
  const boardgames_uid = document.getElementById("boardgameid").value;
  let players = "";
  for (i=0; i<6;i++){
    players = players +",user_UID:,score_round:0"; 
  }
  console.log(players);
  players = players.split(",").map(players => players.trim());
  console.log(players);
  /** Deverá ser controlada a log das respostas 
  answer[
    questionuid
    optionselected
    timeanswer
    scorequestion
  ],
  **/
  const state = "waiting"; // "waiting", "started", "finished"

  // Cria o objeto para salvar o quiz
  const newboardgame = {
    round_date,
    boardgames_uid,
    players,
    level,
    host,
    state,  
  };

  // Chama a função para salvar o quiz no Firestore
  boardgamesService.save(newboardgame);

  // Limpa o formulário após o envio
  document.getElementById("boardgame-form").reset();
});