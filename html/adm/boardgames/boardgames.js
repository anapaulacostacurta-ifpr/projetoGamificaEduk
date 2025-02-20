firebase.auth().onAuthStateChanged((User) => {
  if (!User) {
      window.location.href = "../login/login.html";
  }else{
      userService.findByUid(User.uid).then(user=>{
        document.getElementById("nameUser").innerHTML = user.nickname;
        var avatar = user.avatar;
        document.getElementById("avatarUser").innerHTML ='<img class="img-fluid rounded-circle img-thumbnail" src="../../assets/img/perfil/'+avatar+'.png" width="50" height="50"></img>';
      }).catch(error => {
          console.log(error);
      });

      document.getElementById("activity-form").addEventListener("submit", function(event) {
        event.preventDefault();
       
        var alert_sucesso = document.getElementById("alert_sucesso");
        var alert_error = document.getElementById("alert_error");
        var msg_sucesso = document.getElementById("res_sucesso");
        var msg_error = document.getElementById("res_error");  
      
        // Captura os dados do formulário
        const date_start = new Date((document.getElementById("activity_date_start").value).replace("-","/")).toLocaleDateString('pt-BR');
        const date_final = new Date((document.getElementById("activity_date_final").value).replace("-","/")).toLocaleDateString('pt-BR');
        const time_start = document.getElementById("activity_time_start").value;
        const time_final = document.getElementById("activity_time_final").value;
        const level = document.getElementById("activity_level").value;
        const teacher = User.uid;
        const players = [];
        const id = document.getElementById("activity_id").value;
        const state = "waiting"; // "waiting", "started", "finished"
      
        /** 
        boardgamesService.getBoardGameByRodadaID(boardgameid).then(boardgames=>{
          boardgames.forEach(boardgame=>{
            msg_error.innerHTML= "Atividade: "+boardgame.dados.boardgameid+" já cadastrada!";
          })
        }).catch(error => {
              if(error == "Não encontrado"){
                console.log(error);
              }
        });

        */
      
        // Cria o objeto para salvar o quiz
        const newactivity = {
          date_start,
          date_final,
          time_start,
          time_final,
          players,
          id,
          level,
          teacher,
          state,  
        };
        try{
          boardgamesService.save(newactivity);
          msg_sucesso.innerHTML= "Atividade cadastrada com Sucesso!";
          alert_sucesso.classList.add("show");
          document.getElementById("bt-success").disabled = true;
        } catch (error){
          msg_error.innerHTML= error;
          alert_error.classList.add("show");
        }
    });
  }
})
 
function logout() {
  firebase.auth().signOut().then(() => {
      window.location.href = "../../login/login.html";
  }).catch(() => {
      alert('Erro ao fazer logout');
  })
}

function voltar(){
  window.location.href = "../../home/home.html";
}
