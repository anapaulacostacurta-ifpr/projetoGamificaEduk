var activity_uid;
firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    const main_menu = document.getElementById("main_menu");
    userService.findByUid(User.uid).then(user=>{
      const params = new URLSearchParams(window.location.search);
      activity_uid = params.get('activity_uid');
      activityService.getActivitybyUid(activity_uid).then((activity) => {
        let menu = ``;
        activityTaskService.getTaskActivity(activity_uid).then(activity_tasks => {
          if(!(activity_tasks.length == 0)){
            activity_tasks.forEach(activity_task => {           
                if (!(activity_task.dados.quizzes_id==="")){
                  menu = menu +`<p><button type="button" class="badge bg-primary p-2" id="btnQuiz" onclick="btnQuiz()">QUIZ</button></p>`;
                }
                if(!(activity_task.dados.challange_id==="")){
                  menu = menu + `<p><button type="button" class="badge bg-primary p-2" id="btnDesafio" onclick="btnDesafio()">DESAFIO</button></p>`;
                }
                if(!(activity_task.dados.orienteering_id==="")) {
                  menu = menu + `<p><button type="button" class="badge bg-primary p-2" id="btnOrientacao" onclick="btnOrientacao()">ORIENTAÇÃO</button></p>`;
                }
                if( (!(activity_task.dados.good_fortune_id==="")) && (!(activity_task.dados.tough_luck_id==="")) ){
                  menu = menu + `<p><button type="button" class="badge bg-primary p-2" id="btnSorte" onclick="btnSorteouReves()">SORTE OU REVÉS</button></p>`;
                }
                if (!(activity_task.dados.bonus_id==="")){
                  menu = menu + `<p><button type="button" class="badge bg-warning p-2" id="btnTarefas" onclick="btnBonus()">TAREFAS</button></p>`; 
                }       
                if(!(activity_task.dados.quiz_final_id==="")){
                  menu = menu + `<p><button type="button" class="badge bg-success p-2 border border-2 border-dark" id="btnQuizfinal" onclick="btnQuizfinal()">QUIZ FINAL</button></p>`;
                }
                main_menu.innerHTML = menu;         
                document.getElementById("level").innerHTML = activity.level;
                checkinactivityService.getcheckinbyPlayer(activity_uid,User.uid).then(checkin_ativities =>{
                  checkin_ativities.forEach(checkin_ativity => {
                    document.getElementById("points").innerHTML = checkin_ativity.dados.points;
                  })
                })
            })
          }else{
            menu = "Nenhuma atividade cadastrada. Entre em contato com Adminsitrador do Evento!";
          }
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

