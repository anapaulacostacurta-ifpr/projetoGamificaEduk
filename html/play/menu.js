//var quiz = getAtualQuiz();
var activity_uid;
firebase.auth().onAuthStateChanged((User) => {
  if (!User) {
      window.location.href = "../login/login.html";
  }else{
    userService.findByUid(User.uid).then(user=>{
      document.getElementById("nameUser").innerHTML = user.nickname;
      var avatar = user.avatar;
      document.getElementById("avatarUser").innerHTML ='<img class="img-fluid rounded-circle img-thumbnail" src="../../assets/img/perfil/'+avatar+'.png" width="50" height="50"></img>';
      const params = new URLSearchParams(window.location.search);
      activity_uid = params.get('activity_uid');
        boardgamesService.getActivitybyUid(activity_uid).then((activity) => {
            var players = activity.players;
            var player = players.find(player => player.user_UID == User.uid);
            document.getElementById("score").innerHTML = player.score;
            document.getElementById("level").innerHTML = activity.level;
        });
    }).catch(error => {
        console.log(error);
    });

    
  } 
});

function btnQuiz() {
  window.location.href = "../question/token/token.html?category=quiz&activity_uid="+activity_uid;
}

function btnDesafio() {
  window.location.href = "../question/token/token.html?category=challange&activity_uid="+activity_uid;
}

function btnSorte() {
  window.location.href = "../question/token/token.html?category=luck&activity_uid="+activity_uid;
}

function btnExtra(){
  window.location.href = "../extra/extra.html?category=extra&activity_uid="+activity_uid;
}

function btnQuizfinal(){
  window.location.href = "../question/token/token.html?category=quizfinal&activity_uid="+activity_uid;
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
