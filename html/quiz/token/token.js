// Captura o evento de envio do formulário
document.getElementById("play-form").addEventListener("submit", function(event) {
    event.preventDefault();
  
    // Captura os dados do formulário
    const tokenid = document.getElementById("tokenid").value;
    const user_UID = document.getElementById("userUid").value;
    
    tokenService.getTokensQuiz(tokenid).then(tokens => {
      alert(tokens);
      tokens.forEach(token => {
        alert(token.quiz);        
        });
        window.location.href = "./menu.html";
      });
    });
  