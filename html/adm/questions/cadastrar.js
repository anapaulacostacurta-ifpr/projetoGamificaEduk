firebase.auth().onAuthStateChanged( (User) => {
  if (!User) {
      window.location.href = "../../login/login.html";
  }else{
    // Captura o evento de envio do formulário
    document.getElementById("cadastrar-form").addEventListener("submit", function(event) {
      event.preventDefault();

      // Captura os dados do formulário
      const category = document.getElementById("category").value;
      //const type = document.getElementById("type").value;
      const type = "multiple";
      const level = document.getElementById("level").value;
      const text = document.getElementById("text").value;
      const options = document.getElementById("options").value.split(",").map(option => option.trim()); // Divide as opções
      const answer = document.getElementById("answer").value.split(",").map(answer => answer.trim());

      // Cria o objeto para salvar o quiz
      const newQuiz = {
        category,
        type,
        level,
        text,
        options,
        answer,
      };

      // Chama a função para salvar o quiz no Firestore
      questionsService.save(newQuiz);

      // Limpa o formulário após o envio
      document.getElementById("cadastrar-form").reset();
    });
  }
})

function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "../../login/login.html";
  }).catch(() => {
      alert('Erro ao fazer logout');
  })
}