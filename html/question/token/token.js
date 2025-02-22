var activity_uid;
firebase.auth().onAuthStateChanged( (User) => {
    var player;
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
          var atual_tokens_quiz_used;
          var tokens_quiz;
          boardgamesService.getActivitybyUid(activity_uid).then((activityfind) => {
            var activity = activityfind;
            tmp_players = activityfind.players;
            player = tmp_players.find(player => player.user_UID == User.uid);
            atual_tokens_quiz_used = player.tokens_quiz_used;
            //document.getElementById("score").innerHTML = player.score;
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
                    let pos_token_used = atual_tokens_quiz_used.indexOf(tokenid);  
                    if (!(pos_token_used > -1)){ // Se encontrado foi usado. retorna -1 Não encontrado.
                        if(pos_token > -1){ 
                            let tokens_quiz_used = new Array();
                            let stop = atual_tokens_quiz_used.length;
                            for (i=0; i<stop-1;i++){
                                tokens_quiz_used[i] = atual_tokens_quiz_used[i];
                            }
                            tokens_quiz_used[stop] = tokenid;
                            var players = new Array();
                            let timestamp = new Date().getTime();
                            var last = tmp_players.length;
                            for(i=0;i<last;i++){
                                let quiz_answered = tmp_players[i].quiz_answered;
                                if(tmp_players[i].user_UID == User.uid){
                                    players[i] = {user_UID:tmp_players[i].user_UID,score:tmp_players[i].score,ckeckin_date: tmp_players[i].ckeckin_date,ckeckin_time: tmp_players[i].ckeckin_time, timestamp: timestamp, tokens_quiz_used, quiz_answered};
                                }else{
                                    let tokens_quiz_used = tmp_players[i].tokens_quiz_used;
                                    players[i] = {user_UID:tmp_players[i].user_UID,score:tmp_players[i].score,ckeckin_date: tmp_players[i].ckeckin_date,ckeckin_time: tmp_players[i].ckeckin_time, timestamp: tmp_players[i].timestamp,tokens_quiz_used, quiz_answered};
                                }
                            }                              
                            try{
                                boardgamesService.update(activity_uid, {players}).then(alert("Token Válido!"));
                                window.location.href = "../quiz/quiz.html&activity_uid="+activity_uid;
                            } catch (error) {
                                alert(error);
                                window.location.href = "../../play/menu.html&activity_uid="+activity_uid;
                            }
                        }else{
                            alert("Token inválido!");
                            window.location.href = "../../play/menu.html&activity_uid="+activity_uid;
                        }
                    }else{
                        alert("Token inválido!");
                        window.location.href = "../../play/menu.html&activity_uid="+activity_uid;
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
    window.location.href = "../../play/menu.html&activity_uid="+activity_uid;
}
  
