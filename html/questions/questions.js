
// Captura o evento de envio do formulário
document.getElementById("quiz-form").addEventListener("submit", function(event) {
  event.preventDefault();

  // Captura os dados do formulário
  const category = document.getElementById("category").value;
  const type = document.getElementById("type").value;
  const difficulty = document.getElementById("difficulty").value;
  const question = document.getElementById("question").value;
  const options = document.getElementById("options").value.split(",").map(option => option.trim()); // Divide as opções
  const answer = document.getElementById("answer").value;
  const time_answer = document.getElementById("time_answer").value;
  const feedback_correct = document.getElementById("feedback_correct").value;
  const feedback_incorrect = document.getElementById("feedback_incorrect").value;

  // Cria o objeto para salvar o quiz
  const newQuiz = {
    category,
    type,
    difficulty,
    question,
    options,
    answer,
    time_answer,
    feedback_correct,
    feedback_incorrect
  };

  // Chama a função para salvar o quiz no Firestore
  saveQuiz(newQuiz);

  // Limpa o formulário após o envio
  document.getElementById("quiz-form").reset();
});