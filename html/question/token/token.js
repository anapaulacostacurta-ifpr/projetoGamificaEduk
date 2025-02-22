firebase.auth().onAuthStateChanged( (User) => {
    var activity_uid;
    if (!User) {
        sessionStorage.clear;
        window.location.href = "../login/login.html";
    }else{
        userService.findByUid(User.uid).then(user=>{
            document.getElementById("nameUser").innerHTML = user.nickname;
            var avatar = user.avatar;
            document.getElementById("avatarUser").innerHTML ='<img class="img-fluid rounded-circle img-thumbnail" src="../../../assets/img/perfil/'+avatar+'.png" width="50" height="50"></img>';
            //document.getElementById("score_total").innerHTML = user.score;
          }).catch(error => {
              console.log(error);
          });
          const params = new URLSearchParams(window.location.search);
          const category = params.get('category');
          activity_uid = params.get('activity_uid');
          var tmp_players;
          var tokens_quiz_used;
          var tokens_quiz;
          boardgamesService.getActivitybyUid(activity_uid).then((activityfind) => {
            activity = activityfind;
            var players = activityfind.players;
            var player = players.find(player => player.user_UID == User.uid);
            document.getElementById("score").innerHTML = player.score;
            document.getElementById("level").innerHTML = activity.level;
          });

          tokenService.getTokens().then(tokens => {
                tokens.forEach(token => {
                    tokens_quiz = token.quiz;
                });
            });

          document.getElementById("play-form").addEventListener("submit", function(event) {
            event.preventDefault();
            // Captura os dados do formulário
            let tokenid = document.getElementById("tokenid").value;
                if(category == "quiz"){
                    let pos_token = tokens_quiz.indexOf(tokenid);
                    var players;
                    if(!(tokens_quiz_used === "undefined") || !(tokens_quiz_used === undefined)){
                            if(pos_token > -1){
                                        tokens_quiz_used = new Array();
                                        tokens_quiz_used.push(tokenid);
                                        var players = new Array();
                                        tmp_players.forEach(tmp_player=>{
                                            var player = tmp_players;
                                            if(tmp_player.user_UID = User.uid){
                                                player = {user_UID: tmp_player.user_UID, score_round: tmp_player.score_round, tokens_quiz_used};
                                            }
                                            players.push(player);
                                        })                               
                                try{
                                    boardgamesService.update(boardgameid, {players}).then(alert("Token Válido!"));
                                    window.location.href = "../quiz/quiz.html&activity_uid="+activity_uid;
                                } catch (error) {
                                    alert(error);
                                }
                            }else{
                                alert("Token inválido!");
                                window.location.href = "../../play/menu.html";
                            }
                    }else{    
                        let pos_token_used = tokens_quiz_used.indexOf(tokenid);  
                        let pos_token = tokens_quiz.indexOf(tokenid); 
                        if (pos_token_used > -1){ // Não foi usado  ainda
                            if(pos_token > -1){
                                tmp_players.forEach(player => {
                                    if(player.user_UID == User.uid){
                                        tokens_quiz_used.push(tokenid)
                                        player.push(tokens_quiz_used);
                                    }
                                });
                                boardgamesService.update(boardgameid, {players}).then(alert("Token Válido!"));      
                                window.location.href = "../quiz/quiz.html&activity_uid="+activity_uid;
                            }else{
                                alert("Token inválido!");
                                window.location.href = "../../play/menu.html";
                            }
                        }
                    }   
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
        });
    }
});


function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../home/home.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}    
  
function voltar(){
window.location.href = "../../play/menu.html";
}
