var activity_uid;
firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    const main_menu = document.getElementById("main_menu");
    userService.findByUid(User.uid).then(user=>{
      const params = new URLSearchParams(window.location.search);
      activity_uid = params.get('activity_uid');
      activityService.getActivitybyUid(activity_uid).then((activity) => {
        document.getElementById("level").innerHTML = activity.level;
        checkinactivityService.getcheckinbyPlayer(activity_uid,User.uid).then(checkin_ativities =>{
          checkin_ativities.forEach(checkin_ativity => {
            document.getElementById("points").innerHTML = checkin_ativity.dados.points;
            let menu = ``;
            taskActivityService.getTaskActivity(activity_uid).then(task_activity=>{
              if ( (!(task_activity.quizzes_id===""))  && (!(task_activity.quizzes_id === undefined)) ){
                menu = menu +`<p><button type="button" class="badge bg-primary p-2" id="btnQuiz" onclick="btnQuiz()">QUIZ</button></p>`;
              }
              if( (!(task_activity.challange_id==="")) && (!(task_activity.quizzes_id === undefined)) ){
                menu = menu + `<p><button type="button" class="badge bg-primary p-2" id="btnDesafio" onclick="btnDesafio()">DESAFIO</button></p>`;
              }
              if( (!(task_activity.orienteering_id==="")) && (!(task_activity.quizzes_id === undefined)) ){
                menu = menu + `<p><button type="button" class="badge bg-primary p-2" id="btnOrientacao" onclick="btnOrientacao()">ORIENTAÇÃO</button></p>`;
              }
              if( ( (!(task_activity.good_fortune_id==="")) && (!(task_activity.tough_luck_id==="")) ) && (!(task_activity.quizzes_id === undefined)) ){
                menu = menu + `<p><button type="button" class="badge bg-primary p-2" id="btnSorte" onclick="btnSorteouReves()">SORTE OU REVÉS</button></p>`;
              }
              if( (!(task_activity.bonus_id==="")) && (!(task_activity.quizzes_id === undefined)) ){
                menu = menu + `<p><button type="button" class="badge bg-warning p-2" id="btnTarefas" onclick="btnBonus()">TAREFAS</button></p>`; 
              }       
              if( (!(task_activity.quiz_final_id==="")) && (!(task_activity.quizzes_id === undefined)) ){
                menu = menu + `<p><button type="button" class="badge bg-success p-2 border border-2 border-dark" id="btnQuizfinal" onclick="btnQuizfinal()">QUIZ FINAL</button></p>`;
              }
              main_menu.innerHTML = menu;
            }).catch(error => {
             main_menu.innerHTML = error.message;
            })
          })
        })
      })
    })
  }
});

function btnQuiz() {
  window.location.href = "../token/token.html?category=quiz&activity_uid="+activity_uid;
}

function btnDesafio() {
  window.location.href = "../token/token.html?category=challange&activity_uid="+activity_uid;
}

function btnOrientacao() {
  window.location.href = "../qrcode/scan_qrcode?category=challange&activity_uid="+activity_uid;
}

function btnSorteouReves() {
  window.location.href = "../token/token.html?category=good_fortune&activity_uid="+activity_uid;
}

function btnBonus(){
  window.location.href = "../token/token.html?category=bonus&activity_uid="+activity_uid;
}

function btnQuizfinal(){
  window.location.href = "../token/token.html?category=quiz_final&activity_uid="+activity_uid;
}

