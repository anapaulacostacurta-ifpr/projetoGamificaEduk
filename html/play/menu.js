const scoreTextPoint = document.getElementById("score");
scoreTextPoint.innerHTML = score_roundsessionStorage.getItem("score_round");

function token() {
  window.location.href = "../quiz/token/token.html";
}
        