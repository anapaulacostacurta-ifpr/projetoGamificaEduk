const scoreTextPoint = document.getElementById("score");
sessionStorage.getItem("score_round");
scoreTextPoint.innerHTML = score_round;

function token() {
  window.location.href = "../quiz/token/token.html";
}
        