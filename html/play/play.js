firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    const alert_error = document.getElementById("alert_error");
    const msg_error = document.getElementById("res_error");
    const user_UID = User.uid;
    
    document.getElementById("play-form").addEventListener("submit", async function(event) {
      event.preventDefault();
      const activity_id = document.getElementById("activity_id").value;
      try {
       
        activityService.getActivities(activity_id).then (activities => {
          var activity = validarAtivities(activities);
          if (activity !== null){
            checkinactivityService.getcheckinbyPlayer(activity_id, user_UID).then(checkin_activities =>{
              var checkin_player = (checkin_activities.length === 1) ? checkin_activities[0] : null;
              if (checkin_player != null) {
                alert('Retornando para atividade!');
              } else {
                alert('Realizado check-in na atividade!');
                doCheckin(activity_id, user_UID); 
              }
            })
          } else {
            console.log("Atividade fora do prazo!");
          }
        })
      }catch (error) {
        alert("Erro: " + error.message);
        console.error(error);
      }
      
      //window.location.href = "./menu.html?activity_id="+activity_id;
      });

   
      function validarAtivities(activities) {
          if (activities.length > 1) {
            alert("Verificar com o administrador do Evento a configuração da atividade");
            return null;
          }else{
            if (activities.length === 1) {
              const activity = activities[0].dados;
              if (activity.id === activity_id) {
                const [dStart, mStart, yStart] = activity.date_start.split("/");
                const [hStart, minStart] = activity.time_start.split(":");
                const data_time_start = new Date(yStart, mStart - 1, dStart, hStart, minStart);
      
                const [dEnd, mEnd, yEnd] = activity.date_final.split("/");
                const [hEnd, minEnd] = activity.time_final.split(":");
                const data_time_final = new Date(yEnd, mEnd - 1, dEnd, hEnd, minEnd);
      
                if (date >= data_time_start && date <= data_time_final) {
                  return activities[0];
                } else {
                  alert("Atividade fora do prazo!");
                }
              }
            }else{
              return null;
            }
          }
      }

      function doCheckin(activity_id, user_UID) {
        const date = (new Date()).toLocaleDateString('pt-BR');
        const time = (new Date()).toLocaleTimeString('pt-BR');
        const points = 0;
  
        const checkin_data = {
          activity_id,
          date,
          time,
          points,
          user_UID
        };
        checkinactivityService.save(checkin_data); // usando await para garantir que salve antes de prosseguir
      }
  }
});