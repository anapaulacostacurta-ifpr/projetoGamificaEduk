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
      const activity = getActivitiesByID(activity_id);
      if(activity.length > 0){
        try{
          const ckeckin_player = getcheckinbyPlayer(activity.uid, user_UID);
          if(ckeckin_player.length > 0){
            points = ckeckin_player.points;
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
        conole.log("Atividade fora do prazo!");
      }
      //window.location.href = "./menu.html?activity_id="+activity_id;
      });

      async function getcheckinbyPlayer(activity_id, User_uid) {
        const checkin_ativities = checkinactivityService.getcheckinbyPlayer(activity_id,User_uid);
        if((await checkin_ativities).length == 1){
          return checkin_ativities[0];
        }else{
          throw "Problemas de configuração. Entre em contato com Administrador do Evento!";
        }
      }

      async function getActivitiesByID(activity_id) {
        let date = new Date();
        const activities =  activityService.getActivities(activity_id);
          if ((await activities).length > 1){
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
                return [];
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