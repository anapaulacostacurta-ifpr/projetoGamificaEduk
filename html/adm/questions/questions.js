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
document.getElementById("quiz-form").addEventListener("submit", function(event) {
  event.preventDefault();

  // Captura os dados do formulário
  const category = document.getElementById("category").value;
  const type = document.getElementById("type").value;
  const level = document.getElementById("level").value;
  const text = document.getElementById("text").value;
  const options = document.getElementById("options").value.split(",").map(option => option.trim()); // Divide as opções
  const answer = document.getElementById("answer").value.split(",").map(answer => answer.trim());
  const feedback_correct = document.getElementById("feedback_correct").value;
  const feedback_incorrect = document.getElementById("feedback_incorrect").value;

  // Cria o objeto para salvar o quiz
  const newQuiz = {
    category,
    type,
    level,
    text,
    options,
    answer,
    feedback_correct,
    feedback_incorrect
  };

  // Chama a função para salvar o quiz no Firestore
  questionService.save(newQuiz);

  // Limpa o formulário após o envio
  document.getElementById("quiz-form").reset();
});

function logout() {
  firebase.auth().signOut().then(() => {
      sessionStorage.clear();
      window.location.href = "../../index.html";
  }).catch(() => {
      alert('Erro ao fazer logout');
  })
}