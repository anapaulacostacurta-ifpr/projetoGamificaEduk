var user_UID = sessionStorage.userUid;
var score_total = sessionStorage.score_total + " points";
var nameUser = sessionStorage.nameUser;
var lista_boardgames = document.getElementById("lista_boardgames");


firebase.auth().onAuthStateChanged( (user) => {
  if (!user) {
    sessionStorage.clear;
    window.location.href = "../login/login.html";
  }
})

// Captura o evento de envio do formulário
document.getElementById("startboardgame-form").addEventListener("submit", function(event) {
  event.preventDefault();

  // Captura os dados do formulário
  const round_date = (new Date()).toLocaleDateString('pt-BR');
  const level = document.getElementById("level").value;
  const professor = sessionStorage.userUid;
  const boardgameid = document.getElementById("boardgameid").value;
  const state = "waiting"; // "waiting", "started", "finished"

  let linhas = ''; 
  boardgamesService.getBoardGameByID(boardgameid, round_date, professor, level, state).then(boardgames => {
    setBoardGames(boardgames);
    boardgames.forEach(boardgame => {
            var boardgame_id = boardGame.id;
            var boardgame_dados = boardGame.dados;
            var option = boardgameid;
            let round_id = '<td><span>'+'<label class="form-check-label" for="'+boardgame_dados.boardgameid+'">'+boardgame_dados.boardgameid+'</span></label></td>';
            let level = '<td><span>'+boardgame_dados.level+'</span></td>';
            let round_data = '<td><span>'+boardgame_dados.round_date+'</span></td>';
            let state = '<td><span>'+boardgame_dados.state+'</span></td>';
            let radio = '<td><input type="radio" class="form-check-activate" id="radio_id" name="radio_id" value="'+option+'" checked"></td>';
            linhas = linhas + '<tr>'+radio+round_id+level+round_data+state+'</tr>';
        })
        let tbody = '<tbody>'+linhas+'</tbody>';
        let thead = '<thead><tr><th></th><th>BoardgameID</th><th>Level</th><th>Data</th><th>Status</th></tr></thead>';     
        let table = '<table class="table table-bordered">'+ thead + tbody+'</table><hr class="colorgraph">';
        lista_boardgames.innerHTML = table;
    }).catch((error) => {
        let errorString = '<span>'+ error+'<span>';
        lista_boardgames.innerHTML = errorString;
  });  
});

function logout() {
  firebase.auth().signOut().then(() => {
      sessionStorage.clear();
      window.location.href = "../../home/home.html";
  }).catch(() => {
      alert('Erro ao fazer logout');
  })
}

function voltar(){
  sessionStorage.removeItem('boardgames');
  window.location.href = "../../home/home.html";
}

document.getElementById("ativarboardgame-form").addEventListener("submit", function(event) {
  event.preventDefault();
    let userselect = document.querySelector('input[name="radio_id"]:checked').value;
        var boardgames = {state: "started"};
        boardgamesService.update(userselect, boardgames);
});

function setBoardGames(){
  let boardgamesString = JSON.stringify(boardgames);
  sessionStorage.setItem('boardgames', boardgamesString);
}

function getBoardgames(){
  let boardgamesString = sessionStorage.boardgames;
  let boardgames;
  boardgames = JSON.parse(boardgamesString);
  return boardgames;
}