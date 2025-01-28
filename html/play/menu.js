//Ranking Nível
const scoreLevelPoint = document.getElementById("score_round");
scoreLevelPoint.innerHTML = "Level Score: "+sessionStorage.getItem("score_round");

const level = document.getElementById("level");
level.innerHTML = "Nível: "+sessionStorage.getItem("level");

//Ranking Geral
const scorePoint = document.getElementById("score_total");
scorePoint.innerHTML = "Score Total: "+sessionStorage.getItem("score_total");

function token() {
  window.location.href = "../quiz/token/token.html";
}

function logout() {
  firebase.auth().signOut().then(() => {
      sessionStorage.clear();
      window.location.href = "../../index.html";
  }).catch(() => {
      alert('Erro ao fazer logout');
  })
}
        