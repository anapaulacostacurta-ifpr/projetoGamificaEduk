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

function loadQuestions() {
    const questionsList = document.getElementById('questionUid');
    questionsList.innerHTML = ''; // Limpa a lista de perguntas

    questionService.getAll().then(questions => {
      questions.forEach(question => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <p><strong>UID:</strong> ${question.uid}</p>
          <p><strong>Descrição:</strong> ${question.description}</p>
        `;
        questionsList.appendChild(listItem);
      });
    }).catch(error => {
      console.error('Erro ao carregar perguntas:', error);
    });
  }

  // Chama a função para carregar as perguntas ao carregar a página
  window.onload = loadQuestions;

