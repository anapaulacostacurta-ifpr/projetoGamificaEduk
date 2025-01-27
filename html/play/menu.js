const scoreTextPoint = document.getElementById("score");
scoreTextPoint.innerHTML = "Level Score: "+sessionStorage.getItem("score_round");

function token() {
  window.location.href = "../quiz/token/token.html";
}
        