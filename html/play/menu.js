var activity_uid;
firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    userService.findByUid(User.uid).then(user=>{
      const params = new URLSearchParams(window.location.search);
      activity_uid = params.get('activity_uid');
      activityService.getActivitybyUid(activity_uid).then((activities) => {
        activities.forEach(activity => {
          activity_uid = activity.uid;
          document.getElementById("level").innerHTML = activity.dados.level;
          playerService.getPlayerByActivity(activity_uid,User.uid).then(players =>{    
            players.forEach(player =>{
              if( player.dados.user_UID === User.uid){
                document.getElementById("points").innerHTML = player.dados.points;
              }
            })  
          })
        })
      })
    })
  }
});

function btnQuiz() {
  window.location.href = "../question/token/token.html?category=quiz&activity_uid="+activity_uid;
}

function btnDesafio() {
  window.location.href = "../question/token/token.html?category=challange&activity_uid="+activity_uid;
}

function btnTesouro() {
  window.location.href = "../qrcode/scan_qrcode?category=challange&activity_uid="+activity_uid;
}

function btnSorte() {
  window.location.href = "../question/token/token.html?category=luck&activity_uid="+activity_uid;
}

function btnBonus(){
  window.location.href = "../question/token/token.html?category=bonus&activity_uid="+activity_uid;
}

function btnQuizfinal(){
  window.location.href = "../question/token/token.html?category=quizfinal&activity_uid="+activity_uid;
}

