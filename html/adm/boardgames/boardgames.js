
firebase.auth().onAuthStateChanged( (user) => {
  if (user) {
      sessionStorage.setItem("userUid", user.uid);
      window.location.href = "../home/home.html";
  }else{
      sessionStorage.clear;
      window.location.href = "../login/login.html";
  }
  userService.findByUid(uid).then (user=>{
      if(user === undefined){
          sessionStorage.setItem("profile_atualizar",true);
      }else{
          sessionStorage.setItem("profile_atualizar",false);
          document.getElementById("nameUser").innerHTML = user.name;
          sessionStorage.setItem("score_total",user.score);
          const profiles = user.profiles;
          sessionStorage.setItem("admin",profiles.admin);
          sessionStorage.setItem("professor",profiles.admin);
          sessionStorage.setItem("aluno",profiles.admin);
      }
  }).catch(error => {
      console.log(getErrorMessage(error));
  });
})

// Captura o evento de envio do formulário
document.getElementById("boardgame-form").addEventListener("submit", function(event) {
  event.preventDefault();

  // Captura os dados do formulário
  const round_date = (new Date()).toLocaleDateString('pt-BR');
  const level = document.getElementById("level").value;
  const host = sessionStorage.userUid;
  const boardgameid = document.getElementById("boardgameid").value;
  /** Deverá ser controlada a log das respostas 
  answer[
    questionuid
    optionselected
    timeanswer
    scorequestion
  ],
  **/
  const state = "waiting"; // "waiting", "started", "finished"

  // Cria o objeto para salvar o quiz
  const newboardgame = {
    round_date,
    boardgameid,
    level,
    host,
    state,  
  };

  // Chama a função para salvar o quiz no Firestore
  //boardgamesService.save(newboardgame);
  boardgamesService.save(newboardgame, boardgameid);
  // Limpa o formulário após o envio
  document.getElementById("boardgame-form").reset();
});

function logout() {
  firebase.auth().signOut().then(() => {
      sessionStorage.clear();
      window.location.href = "../../index.html";
  }).catch(() => {
      alert('Erro ao fazer logout');
  })
}