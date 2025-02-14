firebase.auth().onAuthStateChanged((User) => {
  if (!User) {
      window.location.href = "../login/login.html";
  }else{
    userService.findByUid(User.uid).then(user=>{
      document.getElementById("nameUser").innerHTML = user.nickname;
      //var user_UID = User.uid;
      var avatar = user.avatar;
      document.getElementById("avatarUser").innerHTML ='<img class="img-fluid rounded-circle img-thumbnail" src="../../assets/img/perfil/'+avatar+'.png" width="50" height="50"></img>';
      document.getElementById("score_total").innerHTML = user.score;
    }).catch(error => {
        console.log(error);
    });

    document.getElementById("play-form").addEventListener("submit", function(event) {
      event.preventDefault();
      // Captura os dados do formulário
      let id = document.getElementById("activity_id").value;
      let activity_uid; // UID do doc no firestone
      let score = 0;

      boardgamesService.getActivities(id).then((activities) => {
        let hora = (new Date()).toLocaleTimeString('pt-BR');
        let date = (new Date()).toLocaleDateString('pt-BR');
        activities.forEach(activity => {
          if(activity.dados.id == id){
            if(date >= activity.dados.date_start &&  date <= activity.dados.date_final){
              if( hora >= activity.dados.time_start && hora <= activity.dados.time_final){
                  activity_uid = activity.uid; // UID do doc no firestone
                  var tmp_players = activity.dados.players;
                  if (tmp_players === undefined){
                    let players = new Array();
                    players.push({user_UID:User.uid,score:score,ckeckin_date:date,ckeckin_time:hora});
                    boardgamesService.update(activity_uid, {players});
                  }else{
                    let players = new Array();
                    //variável para verficar se o jogador já entrou no tabuleiro
                    let isOnPlayer = false;
                    tmp_players.forEach(player => {
                      if(player.user_UID == User.uid){
                        isOnPlayer = true;
                        score = player.score;
                      }
                      players.push({user_UID:player.user_UID,score:player.score,ckeckin_data:player.ckeckin_data,ckeckin_time:checkin_time});
                    });
                    if (isOnPlayer){
                      alert('Retornando para o Jogo!');
                    }else{
                      players.push({user_UID:User.uid,score:score,ckeckin_data:data,ckeckin_time:hora});
                      boardgamesService.update(activity_uid, {players});
                    }
                  }
                }
              window.location.href = "./menu.html";
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
