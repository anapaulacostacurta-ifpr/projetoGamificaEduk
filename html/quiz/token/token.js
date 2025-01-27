// Captura o evento de envio do formulário
document.getElementById("play-form").addEventListener("submit", function(event) {
    event.preventDefault();
  
    // Captura os dados do formulário
    const tokenid = document.getElementById("tokenid").value;
    const user_UID = document.getElementById("userUid").value;
    
    tokenService.getTokensQuiz().then(tokens => {
      alert(tokens);
      tokens.forEach(token => {
        alert(token.quiz);
        const tokens_quiz = token.quiz;
        if (tokens_quiz.indexOf(tokenid) == 1){
            alert("Token Válido!");
        }else{
            alert("Token inválido!");
        }
        });
        window.location.href = "../../play/menu.html";
      });
    });
  