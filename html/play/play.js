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

      boardgamesService.getActivities(id).then((activities) => {
        activities.forEach(activity => {
          if(activity.dados.id == id){
            if(ckeckin_date >= activity.dados.date_start &&  ckeckin_date <= activity.dados.date_final){
              if( ckeckin_time >= activity.dados.time_start && ckeckin_time <= activity.dados.time_final){
                  activity_uid = activity.uid; // UID do doc no firestone
                  
                    //variável para verficar se o jogador já entrou no tabuleiro
                    let isOnPlayer = false;
                  
                    if (isOnPlayer){
                      alert('Retornando para o Jogo!');
                    }else{
                      boardgamesService.update(activity_uid, {user_UID,score,ckeckin_date,ckeckin_time});
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
