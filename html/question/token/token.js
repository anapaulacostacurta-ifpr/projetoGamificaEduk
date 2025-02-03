//Ranking Nível
const scoreLevelPoint = document.getElementById("score_round");
scoreLevelPoint.innerHTML = "Level Score: "+sessionStorage.getItem("score_round");

const level = document.getElementById("level");
level.innerHTML = "Nível: "+sessionStorage.getItem("level");

//Ranking Geral
const scorePoint = document.getElementById("score_total");
scorePoint.innerHTML = "Score Total: "+sessionStorage.getItem("score_total");

const category = sessionStorage.question_category;

var tokens = getTokens(category);

// Captura o evento de envio do formulário
document.getElementById("play-form").addEventListener("submit", function(event) {
    event.preventDefault();
    // Captura os dados do formulário
    const tokenid = document.getElementById("tokenid").value;
    const user_UID = sessionStorage.getItem("userUid");
    
    let pos_token = tokens_quiz.indexOf(tokenid);
    if ( pos_token > -1){
        alert("Token Válido!");
        sessionStorage.setItem("token",tokenid); // Manter o token durante a resposta da pergunta
        setTokens(tokens_quiz, tokenid);//removendo apenas da sessão o token utilizado.
        if(category == "quiz"){
            window.location.href = "../quiz/quiz.html";
        }
        if(category == "challange"){
            window.location.href = "../challange/challange.html";
        }
        if(category == "luck"){
            window.location.href = "../luck/luck.html";
        }
        if(category == "quiz_final"){
            window.location.href = "../final/final.html";
        }
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
                tokensString = JSON.stringify(tokens_quiz);
                // Store the stringified object in sessionStorage
                sessionStorage.setItem('tokens', tokensString);
            });
        });
    }else{
        // Convert the user object into a string
        tokens_quiz = JSON.parse(tokensString);
    }
    return tokens_quiz;
}


function setTokensQuiz(tokens, tokenid, ){
  // Convert the user object into a string
  let removetoken = tokens.splice(tokens.indexOf(tokenid),1);
  console.log(removetoken);
  let tokensString = JSON.stringify(tokens);
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
  