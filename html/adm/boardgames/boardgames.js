
// Captura o evento de envio do formulário
document.getElementById("boardgame-form").addEventListener("submit", function(event) {
  event.preventDefault();

  // Captura os dados do formulário
  const round_date = document.getElementById("round_date").value;
  const level = document.getElementById("level").value;
  const host = document.getElementById("userUid").value;
  const boardgameid = document.getElementById("boardgameid").value;
  //const players = []; 
  // Incluido na atualização
  /** 
  [
		useruid,
		answer[
			questionuid
			optionselected
			timeanswer
			scorequestion
		],
		scoreround,		
	]
**/
  const state = "waiting"; // "waiting", "started", "finished"

  // Cria o objeto para salvar o quiz
  const newboardgame = {
    round_date,
    boardgameid,
    level,
    host,
    state,
  };

  // Chama a função para salvar o quiz no Firestore
  boardgamesService.save(newboardgame);

  // Limpa o formulário após o envio
  document.getElementById("boardgame-form").reset();
});