firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    var alert_error = document.getElementById("alert_error");
    var msg_error = document.getElementById("res_error");  
    var activity_id;
    var user_UID = User.uid;
    document.getElementById("play-form").addEventListener("submit", function(event) {
      event.preventDefault();
      // Captura os dados do formulário
      activity_id = document.getElementById("activity_id").value;
      var noPrazo = verificarAtividade(activity_id);
      if(noPrazo){
        try{
            var checkin_ok = verificarCheckin(activity_id, user_UID);
            if(checkin_ok){
              alert('Retornando para atividade!');
            }else{
              // Checkin vazio.
              alert('Realizado check-in na atividade!');
              doCheckin();
            }
        }catch(error){
          alert(error.message);
        }
      }else{
        console.log("Atividade fora do prazo!");
      }
      //window.location.href = "./menu.html?activity_id="+activity_id;
      });

      async function verificarCheckin(activity_id, user_UID) {
        const ckeckin_player = await getcheckinbyPlayer(activity.uid, user_UID);
          if(ckeckin_player != null){
            points = ckeckin_player.points;
            return true;
          } else {
            console.log("Problemas na Validação do Checkin!")
            return false;
          }
      }

      async function getcheckinbyPlayer(activity_id, User_uid) {
        const checkin_ativities = await checkinactivityService.getcheckinbyPlayer(activity_id,User_uid);
        if(checkin_ativities.length == 1){
          return checkin_ativities[0];
        }else{
          return null;
        }
      }

      async function verificarAtividade(activity_id) {
        const activity = await getActivitiesByID(activity_id);
          if (activity != null) {
            return true;
          } else {
            console.log("Problemas na Validação da Atividade!");
            return false;
          }
      }

      async function getActivitiesByID(activity_id) {
        let date = new Date();
        const activities =  await activityService.getActivities(activity_id);
          if (activities.length > 1){
            alert("Verificar com o administrador do Evento a configuração da atividade");
          }else{
            var activity = activities[0].dados;
            if(activity.id == activity_id){
              let data_start = activity.date_start.split("/");
              let time_start = activity.time_start.split(":");
              let data_time_start = new Date(data_start[2],data_start[1]-1,data_start[0],time_start[0],time_start[1]);
              let data_final = activity.date_final.split("/");
              let time_final = activity.time_final.split(":");
              let data_time_final = new Date(data_final[2],data_final[1]-1,data_final[0],time_final[0],time_final[1]);
  
              if(date >= data_time_start &&  date <= data_time_final){
                //Atividade dentro do prazo!
                // No futuro implementar a verificação do checkout e encerramento da atividade.
                return activities[0];
              }else{
                alert("Atividade fora do prazo!")
                return null;
              }
            }
          }
      }

      function doCheckin(){
        let date = (new Date()).toLocaleDateString('pt-BR');
        let time = (new Date()).toLocaleTimeString('pt-BR');
        let points = 0;
        //let activity_id = activity_id;
        const checkin_ativities = {
          activity_id,
          date, 
          time,
          points,
          user_UID,
        };
        checkinactivityService.save(checkin_ativities);
      }

  }
});