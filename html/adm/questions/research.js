firebase.auth().onAuthStateChanged( (User) => {
  if (!User) {
    window.location.href = "../login/login.html";
  }else{
    const questionsList = document.getElementById('questionUid');
    questionsList.innerHTML = ''; // Limpa a lista de perguntas

    document.getElementById("consultar-form").addEventListener("submit", function(event) {
      event.preventDefault();
      // Captura os dados do formulário
      const level = document.getElementById("level").value;
      const category = document.getElementById("category").value;
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
          alert('Erro ao carregar perguntas:'+error.message);
      });
  
    });
  }
})

function logout() {
  firebase.auth().signOut().then(() => {
      window.location.href = "../../index.html";
  }).catch(() => {
      alert('Erro ao fazer logout');
  })
}

function newQuestion() {
  window.location.href = "../questions/questions.html";
}
