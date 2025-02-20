//var quiz = getAtualQuiz();
firebase.auth().onAuthStateChanged((User) => {
  if (!User) {
      window.location.href = "../login/login.html";
  }else{
    //var boardgameid;
    userService.findByUid(User.uid).then(user=>{
      document.getElementById("nameUser").innerHTML = user.nickname;
      var avatar = user.avatar;
      document.getElementById("avatarUser").innerHTML ='<img class="img-fluid rounded-circle img-thumbnail" src="../../assets/img/perfil/'+avatar+'.png" width="50" height="50"></img>';
      const params = new URLSearchParams(window.location.search);
      const activity_uid = params.get('activity_uid');
        boardgamesService.getActivitybyUid(activity_uid).then((activities) => {
          activities.forEach(activity => {
            var players = activity.dados.players;
            players.forEach(player => {
              if(player.user_UID == User.uid){
                document.getElementById("score").innerHTML = player.score;
                document.getElementById("level").innerHTML = activity.dados.level;
              }
            });
          });
        });
    }).catch(error => {
        console.log(error);
    });

    
  } 
});

function btnQuiz() {
  window.location.href = "../question/token/token.html?category=quiz";
}

function btnDesafio() {
  window.location.href = "../question/token/token.html?category=challange";
}

function btnSorte() {
  window.location.href = "../question/token/token.html?category=luck";
}

function btnExtra(){
  window.location.href = "../extra/extra.html?category=extra"
}

function btnQuizfinal(){
  window.location.href = "../question/token/token.html?category=quizfinal";
}

function logout() {
  firebase.auth().signOut().then(() => {
      window.location.href = "../home/home.html";
  }).catch(() => {
      alert('Erro ao fazer logout');
  })
}

function btnVoltar(){
  window.location.href = "../home/home.html";
}
