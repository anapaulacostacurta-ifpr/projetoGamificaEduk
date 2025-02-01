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

function logout() {
  firebase.auth().signOut().then(() => {
      sessionStorage.clear();
      window.location.href = "../../index.html";
  }).catch(() => {
      alert('Erro ao fazer logout');
  })
}

function newQuestion() {
  window.location.href = "../questions/questions.html";
}

document.getElementById("boardgame-form").addEventListener("submit", function(event) {
  event.preventDefault();

  // Captura os dados do formulário
  const level = document.getElementById("level").value;
  const category = document.getElementById("category").value;

  loadQuestionsbyCategoryandLevel(category,level);

});

function loadQuestions() {
    const questionsList = document.getElementById('questionUid');
    questionsList.innerHTML = ''; // Limpa a lista de perguntas

    questionService.getAll().then(questions => {
      questions.forEach(question => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <p><strong>UID:</strong> ${question.uid}</p>
          <p><strong>Level:</strong> ${question.level}</p>
          <p><strong>Pergunta:</strong> ${question.text}</p>
          <p><strong>Respostas:</strong> ${question.options}</p>
        `;
        questionsList.appendChild(listItem);
      });
    }).catch(error => {
      alert('Erro ao carregar perguntas:', error);
    });
  }

  function loadQuestionsbyCategoryandLevel(category,level) {
    const questionsLevel = document.getElementById('questionLevel');

    questionService.getQuestionsByLevel(level,category).then(questions => {
      questions.forEach(question => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <p><strong>numb:</strong> ${question.numb}</p>
          <p><strong>Level:</strong> ${question.level}</p>
          <p><strong>Category:</strong> ${question.category}</p>
          <p><strong>Pergunta:</strong> ${question.text}</p>
          <p><strong>Respostas:</strong> ${question.options}</p>
          <p><strong>Resposta Correta:</strong> ${question.answer}</p>
          <p><strong>Resposta Correta:</strong> ${question.type}</p>
        `;
        questionsLevel.appendChild(listItem);
      });
    }).catch(error => {
      Alert('Erro ao carregar perguntas:', error);
    });
  }
