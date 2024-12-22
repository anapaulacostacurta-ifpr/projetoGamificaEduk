
document.getElementById("quiz-form").addEventListener("submit", function(event) {
  event.preventDefault();

  // Captura os valores do formulário
  const category = document.getElementById("category").value;
  const type = document.getElementById("type").value;
  const difficulty = document.getElementById("difficulty").value;
  const question = document.getElementById("question").value;
  const options = document.getElementById("options").value.split(",").map(option => option.trim());
  const answer = document.getElementById("answer").value;

  // Cria o objeto com os dados para salvar
  const newQuiz = {
    category,
    type,
    difficulty,
    question,
    options,
    answer
  };

  // Chama a função para salvar o quiz no Firestore
  saveQuiz(newQuiz);

  // Limpa o formulário após o envio
  document.getElementById("quiz-form").reset();
});