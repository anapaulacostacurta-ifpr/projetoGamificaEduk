//Ranking Nível
const scoreLevelPoint = document.getElementById("score_round");
scoreLevelPoint.innerHTML = "Level Score: "+sessionStorage.getItem("score_round");

const level = document.getElementById("level");
level.innerHTML = "Nível: "+sessionStorage.getItem("level");

//Ranking Geral
const scorePoint = document.getElementById("score_total");
scorePoint.innerHTML = "Score Total: "+sessionStorage.getItem("score_total");

// Captura o evento de envio do formulário
document.getElementById("play-form").addEventListener("submit", function(event) {
    event.preventDefault();
    // Captura os dados do formulário
    const tokenid = document.getElementById("tokenid").value;
    const user_UID = sessionStorage.getItem("userUid");
    
    tokenService.getTokens().then(tokens => {
      tokens.forEach(token => {
        const tokens_quiz = token.quiz;
        if (tokens_quiz.indexOf(tokenid) > 0){
            alert("Token Válido!");
            sessionStorage.setItem("token",tokenid);
            //passar o token para a pagina do quiz e gravar no banco de dados.
            window.location.href = "../quiz.html";
        }else{
            alert("Token inválido!");
            window.location.href = "../../play/menu.html";
        }
        });
      });
    });
  