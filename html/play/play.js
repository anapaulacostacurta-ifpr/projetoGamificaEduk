firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    var alert_error = document.getElementById("alert_error");
    var msg_error = document.getElementById("res_error");  
    var activity_uid;
    var user_UID = User.uid;
    var ischeckin = true;
    document.getElementById("play-form").addEventListener("submit", function(event) {
      event.preventDefault();
      // Captura os dados do formulário
      let activity_id = document.getElementById("activity_id").value;
      let date = new Date();
      
      activityService.getActivities(activity_id).then((activities) => {
        activities.forEach(activity => {
          if(activity.dados.id == activity_id){
            let data_start = activity.dados.date_start.split("/");
            let time_start = activity.dados.time_start.split(":");
            let data_time_start = new Date(data_start[2],data_start[1]-1,data_start[0],time_start[0],time_start[1]);
            let data_final = activity.dados.date_final.split("/");
            let time_final = activity.dados.time_final.split(":");
            let data_time_final = new Date(data_final[2],data_final[1]-1,data_final[0],time_final[0],time_final[1]);

            if(date >= data_time_start &&  date <= data_time_final){
                  activity_uid = activity.uid; // UID do doc no firestone
                  playerService.getPlayerByActivity(activity_uid,user_UID).then(players =>{
                      var last = players.length;
                      var points;
                      for(i=0;i<last;i++){
                        var player = players[i].dados;
                        if(player.user_UID == user_UID){
                          points = player.points;
                          ischeckin=false;
                          break;
                        }
                      }
                      if(ischeckin){
                        checkin();
                        alert('Realizado check-in na atividade!');
                      }else{
                        alert('Retornando para atividade!');
                      }
                      window.location.href = "./menu.html?activity_uid="+activity_uid;
                  }).catch((error) => {
                    msg_error.innerHTML= error.menssage;
                    alert_error.classList.add("show");
                    document.getElementById("bt-success").disabled = true;
                  })
            }   
          }  
        });
          
        function checkin(){
          let date = new Date();
          let checkin_date = date.toLocaleDateString('pt-BR');
          let checkin_time = date.toLocaleTimeString('pt-BR');
          let timestamp = date.getTime();
          let check_in = {date:checkin_date,time:checkin_time};
          let check_out = {date:"",time:""};
          let points = 0;
          let bonus_answered  = [];
          let bonus_tokens_used = [];
          let quiz_answered = [];
          let quiz_tokens_used = [];
          let luck_answered = [];
          let luck_tokens_used = [];
          let setback_answered = [];
          let setback_tokens_used = [];
          let challange_answered = [];
          let challange_tokens_used = [];
          let quiz_final_answered = [];
          let quiz_final_tokens_used = [];
          const players = {
            activity_id,
            user_UID,
            check_in,
            check_out,
            timestamp,
            points, 
            bonus_answered, 
            bonus_tokens_used,
            quiz_answered, 
            quiz_tokens_used, 
            luck_answered, 
            luck_tokens_used, 
            setback_answered,
            setback_tokens_used,  
            challange_answered, 
            challange_tokens_used, 
            quiz_final_answered, 
            quiz_final_tokens_used,
          };
          playerService.save(players);
        }
      });
    })
  }
});