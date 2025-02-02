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
  const host = sessionStorage.userUid;
  const boardgameid = document.getElementById("boardgameid").value;
  const state = "waiting"; // "waiting", "started", "finished"

  let linhas = ''; 
  boardgamesService.getBoardGameByID(boardgameid, round_date, host, level, state).then(boardgames => {
    boardgames.forEach(boardgame => {
            let boardgame_id = '<td><span>'+boardgame.boardgameid+'</span></td>';
            let host = '<td><span>'+boardgame.host+'</span></td>';
            let level = '<td><span>'+boardgame.level+'</span></td>';
            let round_data = '<td><span>'+boardgame.round_date+'</span></td>';
            let state = '<td><span>'+boardgame.state+'</span></td>';
            linhas = linhas +'<tr>'+boardgame_id+host+level+round_data+state+'</tr>';
        })
        let tbody = '<tbody>'+linhas+'</tbody>';
        let thead = '<thead><tr><th>BoardgameID</th><th>Professor</th><th>Level</th><th>Data</th><th>Status</th></tr></thead>';     
        let table = '<table class="table table-bordered">'+ thead + tbody+'</table>';
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

  