document.addEventListener("DOMContentLoaded", async () => {
  await initializeQuiz();
  loadQuestion();
});

let currentQuestionIndex = 0;
let score = 0;
let questions = []; // Variável inicializada como array vazio

// Seletores do DOM
const categoryDisplay = document.getElementById("category-display");
const typeDisplay = document.getElementById("type-display");
const difficultyDisplay = document.getElementById("difficulty-display");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const submitButton = document.getElementById("submit-button");
const resultContainer = document.getElementById("result-container");
const scoreMessage = document.getElementById("score-message");
const scoreElement = document.getElementById("score");
const totalQuestions = document.getElementById("total-questions");
const restartButton = document.getElementById("restart-button");
const quizContainer = document.getElementById("quiz-container");

// Função para inicializar o quiz e carregar perguntas do Firestore
function initializeQuiz() {
  try {
      questions = questionService.getAll(); // Carrega perguntas do Firestore
  } catch (error) {
      console.error("Erro ao carregar perguntas:", error);
      alert("Falha ao carregar perguntas. Tente novamente mais tarde.");
  }
}

// Função para carregar uma pergunta
function loadQuestion() {
  if (currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      categoryDisplay.textContent = `Categoria: ${currentQuestion.category}`;
      typeDisplay.textContent = `Tipo: ${currentQuestion.type}`;
      difficultyDisplay.textContent = `Dificuldade: ${currentQuestion.difficulty}`;
      questionText.textContent = currentQuestion.question;
      optionsContainer.innerHTML = "";

      currentQuestion.options.forEach((option, index) => {
          const optionElement = document.createElement("input");
          optionElement.type = "radio";
          optionElement.name = "option";
          optionElement.id = `option-${index}`;
          optionElement.value = option;

          const labelElement = document.createElement("label");
          labelElement.htmlFor = `option-${index}`;
          labelElement.textContent = option;

          const div = document.createElement("div");
          div.appendChild(optionElement);
          div.appendChild(labelElement);

          optionsContainer.appendChild(div);
      });

      submitButton.style.display = "block";
      submitButton.onclick = validateAnswer;
  } else {
      showResults();
  }
}

// Função para validar a resposta
function validateAnswer() {
  const selectedOption = document.querySelector("input[name='option']:checked");
  if (!selectedOption) {
      alert("Por favor, selecione uma resposta.");
      return;
  }

  const correctAnswers = questions[currentQuestionIndex].answer;
  if (correctAnswers.includes(selectedOption.value)) {
      score++;
      alert(questions[currentQuestionIndex].feedback_correct);
  } else {
      alert(questions[currentQuestionIndex].feedback_incorrect);
  }

  currentQuestionIndex++;
  loadQuestion();
}

// Função para exibir os resultados
function showResults() {
  quizContainer.style.display = "none";
  resultContainer.style.display = "block";
  scoreElement.textContent = score;
  totalQuestions.textContent = questions.length;
}

// Reiniciar o quiz
restartButton.onclick = () => {
  score = 0;
  currentQuestionIndex = 0;
  resultContainer.style.display = "none";
  quizContainer.style.display = "block";
  loadQuestion();
};



