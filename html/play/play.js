firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    var alert_error = document.getElementById("alert_error");
    var msg_error = document.getElementById("res_error");  
    var activity_uid;
    var points = 0;
    var user_UID = User.uid;
    var ischeckin = true;
    document.getElementById("play-form").addEventListener("submit", function(event) {
      event.preventDefault();
      // Captura os dados do formulário
      let id = document.getElementById("activity_id").value;
      activity_uid; // UID do doc no firestone
      
      let date = new Date();
      
      activityService.getActivities(id).then((activities) => {
        activities.forEach(activity => {
          if(activity.dados.id == id){
            let data_start = activity.dados.date_start.split("/");
            let time_start = activity.dados.time_start.split(":");
            let data_time_start = new Date(data_start[2],data_start[1]-1,data_start[0],time_start[0],time_start[1]);
            let data_final = activity.dados.date_final.split("/");
            let time_final = activity.dados.time_final.split(":");
            let data_time_final = new Date(data_final[2],data_final[1]-1,data_final[0],time_final[0],time_final[1]);

            if(date >= data_time_start &&  date <= data_time_final){
                  activity_uid = activity.uid; // UID do doc no firestone
                  var players = activity.dados.players;
                  var last = players.length;
                  for(i=0;i<last;i++){
                    if(players[i].user_UID == user_UID){
                      points = players[i].points;
                      
                      ischeckin=false;
                      break;
                    }
                  }
                  if(ischeckin){
                    checkin(activity);
                    alert('Realizado Check-in na Atividade!');
                  }else{
                    alert('Retornando para Atividade!');
                  }
                  window.location.href = "./menu.html?activity_uid="+activity_uid;
            }else{
              msg_error.innerHTML= "Atividade fora do prazo!";
              alert_error.classList.add("show");
              document.getElementById("bt-success").disabled = true;
            }
          }else{
            msg_error.innerHTML= "Atividade não encontrada!";
            alert_error.classList.add("show");
            document.getElementById("bt-success").disabled = true;
          }  
        });
        }).catch((error) => {
          msg_error.innerHTML= error.menssage;
          alert_error.classList.add("show");
          document.getElementById("bt-success").disabled = true;
        })
        
      });

    function checkin(activity){
      var players = new Array();
      var tmp_players = activity.dados.players;
      var last = tmp_players.length;
      let date = new Date();
      let checkin_date = date.toLocaleDateString('pt-BR');
      let checkin_time = date.toLocaleTimeString('pt-BR');
      let timestamp = date.getTime();
      for(i=0;i<last;i++){       
        let user_UID = tmp_players[i].user_UID;
        let points = tmp_players[i].points;
        let timestamp = tmp_players[i].timestamp;

        let quiz_answered = new Array();
        let atual_quiz_answered = tmp_players[i].user_answered.quiz.questions;
        for (j=0; j<atual_quiz_answered.length;j++){
            quiz_answered[j] = atual_quiz_answered[j];
        }
        let tokens_quiz_used = new Array();
        let atual_tokens_quiz_used = tmp_players[i].user_answered.quiz.tokens_used;
        for (j=0; j<atual_tokens_quiz_used.length;j++){
            tokens_quiz_used[j] = atual_tokens_quiz_used[j];
        }
        let bonus_answered = new Array();
        let atual_bonus_answered =  tmp_players[i].user_answered.bonus.questions;
        for (j=0; i<atual_bonus_answered.length;j++){
          bonus_answered[j] = atual_bonus_answered[j];
        }
        let tokens_bonus_used = new Array();
        let atual_tokens_bonus_used = tmp_players[i].user_answered.bonus.tokens_used;
        for (j=0; i<atual_tokens_bonus_used.length;j++){
          tokens_bonus_used[j] = atual_tokens_bonus_used[j];
        }
    
        let luck_answered = new Array();
        let atual_luck_answered =  tmp_players[i].user_answered.luck.questions;
        let last_luck = atual_luck_answered.length;
        for (j=0; i< last_luck;j++){
          luck_answered[j] = atual_luck_answered[j];
        }
        let tokens_luck_used = new Array();
        let atual_tokens_luck_used = tmp_players[i].user_answered.luck.tokens_used;
        let last_tokens_luck_used = atual_tokens_luck_used.length;
        for (j=0; i<last_tokens_luck_used;j++){
          tokens_luck_used[j] = atual_tokens_luck_used[j];
        }
        let setback_answered = new Array();
        let atual_setback_answered =  tmp_players[i].user_answered.setback.questions;
        let last_setback = atual_setback_answered;
        for (j=0; i<last_setback;j++){
          setback_answered[j] = atual_setback_answered[j];
        }
        let tokens_setback_used = new Array();
        let atual_tokens_setback_used = tmp_players[i].user_answered.setback.tokens_used;
        let last_tokens_setback_used = atual_tokens_setback_used.length;
        for (j=0; i<last_tokens_setback_used;j++){
          tokens_setback_used[j] = atual_tokens_setback_used[j];
        }
        let challange_answered = new Array();
        let atual_challange_answered =  tmp_players[i].user_answered.challange.questions;
        for (j=0; i<atual_challange_answered.length;j++){
          challange_answered[j] = atual_challange_answered[j];
        }
        let tokens_challange_used = new Array();
        let atual_tokens_challange_used = tmp_players[i].user_answered.challange.tokens_used;
        for (j=0; i<atual_tokens_challange_used.length;j++){
          tokens_challange_used[j] = atual_tokens_challange_used[j];
        }
        let quiz_final_answered = new Array();
        let atual_quiz_final_answered =  tmp_players[i].user_answered.quiz_final.questions;
        for (j=0; i<atual_quiz_final_answered.length;j++){
          quiz_final_answered[j] = atual_quiz_final_answered[j];
        }
        let tokens_quiz_final_used = new Array();
        let atual_tokens_quiz_final_used = tmp_players[i].user_answered.quiz_final.tokens_used;
        for (j=0; i<atual_tokens_quiz_final_used.length;j++){
          tokens_quiz_final_used[j] = atual_tokens_quiz_final_used[j];
        }

        let check_in = {date:tmp_players[i].check_in.date,time:tmp_players[i].check_in.time};
        let check_out = {date:tmp_players[i].check_out.date,time:tmp_players[i].check_out.time};
        let bonus = {questions:bonus_answered,tokens_used:tokens_bonus_used};
        let quiz = {questions:quiz_answered,tokens_used:tokens_quiz_used}; 
        let luck = {questions:luck_answered,tokens_used:tokens_luck_used};
        let setback = {questions:setback_answered,tokens_used:tokens_setback_used};
        let challange = {questions: challange_answered,tokens_used:tokens_challange_used};
        let quiz_final = {questions:quiz_final_answered,tokens_used:tokens_quiz_final_used};
        let user_answered = {bonus, quiz, luck,  setback, challange,quiz_final};
        players[i] = {user_UID,points,check_in,check_out, timestamp,user_answered};
      }
      let check_in = {date:checkin_date,time:checkin_time};
      let check_out = {date:"",time:""};
      let questions = [];
      let tokens_used = [];
      let bonus = {questions,tokens_used};
      let quiz = {questions,tokens_used}; 
      let luck = {questions,tokens_used};
      let setback = {questions,tokens_used};
      let challange = {questions,tokens_used};
      let quiz_final = {questions,tokens_used};
      let user_answered = {bonus, quiz, luck,  setback, challange,quiz_final};
      players[last] = {user_UID,points,check_in,check_out, timestamp, user_answered}
      activityService.update(activity_uid, {players});
    }
  }
});