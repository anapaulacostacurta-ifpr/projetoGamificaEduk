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
    
    var tokens_quiz = getTokens();
    let pos_token = tokens_quiz.indexOf(tokenid);
    if ( pos_token > -1){
        alert("Token Válido!");
        sessionStorage.setItem("token",tokenid); // Manter o token durante a resposta da pergunta
        setTokens(tokens_quiz, pos_token);//removendo apenas da sessão o token utilizado.
        window.location.href = "../quiz.html";
    }else{
        alert("Token inválido!");
        window.location.href = "../../play/menu.html";
    }
    
    });
function getTokens(){
    var tokensString = sessionStorage.tokens;
    var tokens_quiz;
    if (tokensString === undefined){
        tokenService.getTokens().then(tokens => {
            tokens.forEach(token => {
                tokens_quiz = token.quiz;
                let tokensString = JSON.stringify(tokens_quiz);
                // Store the stringified object in sessionStorage
                sessionStorage.setItem('tokens', tokensString);
            });
        });
    }else{
        // Convert the user object into a string
        tokens_quiz = JSON.parse(tokensString);
        console.log(tokens_quiz);
    }
    return tokens_quiz;
}

function setTokens(tokens_quiz, pos_token){
    // Convert the user object into a string
  let tokensString = JSON.stringify(tokens_quiz.slice(pos_token,1));
  // Store the stringified object in sessionStorage
  console.log(tokensString);
  sessionStorage.setItem('tokens', tokensString);
}

function logout() {
    firebase.auth().signOut().then(() => {
        sessionStorage.clear();
        window.location.href = "../../index.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}    
  