firebase.auth().onAuthStateChanged((User) => {
  if (!User) {
      window.location.href = "../login/login.html";
  }else{
    userService.findByUid(User.uid).then(user=>{
      document.getElementById("nameUser").innerHTML = user.nickname;
      //var user_UID = User.uid;
      var avatar = user.avatar;
      document.getElementById("avatarUser").innerHTML ='<img class="img-fluid rounded-circle img-thumbnail" src="../../assets/img/perfil/'+avatar+'.png" width="50" height="50"></img>';
    }).catch(error => {
        console.log(error);
    });

    document.getElementById("play-form").addEventListener("submit", function(event) {
      event.preventDefault();
      // Captura os dados do formulário
      let id = document.getElementById("activity_id").value;
      let activity_uid; // UID do doc no firestone
      let score = 0;
      let user_UID = User.uid;
      let ckeckin_date = (new Date()).toLocaleDateString('pt-BR');
      let ckeckin_time = (new Date()).toLocaleTimeString('pt-BR');
      let timestamp = new Date().getTime();

      boardgamesService.getActivities(id).then((activities) => {
        activities.forEach(activity => {
          if(activity.dados.id == id){
            if(ckeckin_date >= activity.dados.date_start &&  ckeckin_date <= activity.dados.date_final){
              if( ckeckin_time >= activity.dados.time_start && ckeckin_time <= activity.dados.time_final){
                  activity_uid = activity.uid; // UID do doc no firestone
                    var players = new Array();
                    var tmp_players = activity.dados.players;
                    var last = tmp_players.length;
                    for(i=0;i<last;i++){
                      if(tmp_players[i].user_UID == user_UID){
                        score = tmp_players[i].score;
                        alert('Retornando para o Jogo!');
                        window.location.href = "./menu.html?activity_uid="+activity_uid;
                      }else{
                        let quiz_answered = new Array();
                        for (i=0; i<atual_quiz_answered.length;i++){
                          quiz_answered[i] = atual_quiz_answered[i];
                        }
                        let tokens_quiz_used = new Array();
                        for (i=0; i<atual_tokens_quiz_used.length;i++){
                          tokens_quiz_used[i] = atual_tokens_quiz_used[i];
                        }
                        let user_UID = tmp_players[i].user_UID;
                        let score = tmp_players[i].score;
                        let ckeckin_date = tmp_players[i].ckeckin_date;
                        let ckeckin_time = tmp_players[i].ckeckin_time;
                        let timestamp = tmp_players[i].timestamp;
                        players[i] = {user_UID,score,ckeckin_date,ckeckin_time, timestamp,quiz_answered,tokens_quiz_used};
                      }
                    }
                    let quiz_answered = [];
                    let tokens_quiz_used = [];
                    players[last] = {user_UID,score,ckeckin_date,ckeckin_time,timestamp,quiz_answered,tokens_quiz_used};
                    boardgamesService.update(activity_uid, {players}).then(window.location.href = "./menu.html?activity_uid="+activity_uid);
              }
            }else{
              alert("Atividade fora do prazo!");
            }
          }else{
            alert("Atividade Não encontrada!");
          }  
        });
      }).catch((error) => {
        alert(error.menssage);
      })
    })
    
  }
});

function voltar(){
  window.location.href = "../home/home.html";
}

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../login/login.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}
