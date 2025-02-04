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
    boardgames.forEach(boardgame => {
            var option = boardgame.boardgameid+";"+boardgame.level+";"+boardgame.round_date+";"+professor;
            let boardgame_id = '<td><span>'+'<label class="form-check-label" for="'+boardgame.boardgameid+'">'+boardgame.boardgameid+'</span></label></td>';
            let level = '<td><span>'+boardgame.level+'</span></td>';
            let round_data = '<td><span>'+boardgame.round_date+'</span></td>';
            let state = '<td><span>'+boardgame.state+'</span></td>';
            let radio = '<input type="radio" class="form-check-activate" id="radio_id" name="radio_id" value="'+option+'" checked">';
            linhas = linhas + '<tr>'+radio+boardgame_id+level+round_data+state+'</tr>';
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
  window.location.href = "../../home/home.html";
}

document.getElementById("ativarboardgame-form").addEventListener("submit", function(event) {
  event.preventDefault();
    let userselect = document.querySelector('input[name="radio_id"]:checked').value;
    const option = userselect.split(";");
    let boardgame_id = option[0];
    let level = option[1];
    let round_data = option[2];
    let professor = option[3];
    
});