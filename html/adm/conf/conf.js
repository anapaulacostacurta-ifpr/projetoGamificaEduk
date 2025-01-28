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

  function loadQuestionsbyLevel() {
    const questionsLevel = document.getElementById('questionLevel');
    questionsLevel.innerHTML = ''; // Limpa a lista de perguntas

    questionService.getQuestionsByLevel(2,'quiz').then(questions => {
      questions.forEach(question => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <p><strong>UID:</strong> ${question.id}</p>
          <p><strong>Level:</strong> ${question.level}</p>
          <p><strong>Pergunta:</strong> ${question.text}</p>
          <p><strong>Respostas:</strong> ${question.options}</p>
        `;
        questionsLevel.appendChild(listItem);
      });
    }).catch(error => {
      Alert('Erro ao carregar perguntas:', error);
    });
  }

  // Chama a função para carregar as perguntas ao carregar a página
  //window.onload = loadQuestions; 
  window.onload = loadQuestionsbyLevel;
