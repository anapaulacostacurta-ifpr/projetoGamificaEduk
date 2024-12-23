const app = document.getElementById('app');

// Variáveis de estado do quiz
let currentQuestion = 0;
let questions = [];
let score = 0;

// Função para buscar as perguntas do Firestore
async function getQuestions() {
  // Utilize o questionService para buscar as perguntas
  // ...
  questions = await questionService.getAll();
  startQuiz();
}

// Função para iniciar o quiz
function startQuiz() {
  // Exibir a div de quiz
  showElement(document.querySelector('.quiz_box'));
  // Renderizar a primeira pergunta
  renderQuestion();
}

// Função para renderizar a pergunta atual
function renderQuestion() {
  const question = questions[currentQuestion];
  // Inserir o texto da pergunta na div apropriada
  // ...
  // Inserir as opções de resposta na div apropriada
  // ...
  // Habilitar eventos de click nas opções
  // ...
}

// Função para verificar a resposta selecionada
function checkAnswer(option) {
  const answer = questions[currentQuestion].answer;
  // Comparar a opção selecionada com a resposta correta
  // ...
  if (answer === option) {
    // Aumentar a pontuação
    score++;
    // Indicar resposta correta visualmente
  } else {
    // Indicar resposta incorreta visualmente
  }
  // Habilitar o botão para próxima pergunta
  enableNextButton();
}

// Função para habilitar o botão para próxima pergunta
function enableNextButton() {
  // Habilitar o botão 'Próxima Pergunta'
  // ...
}

// Função para ir para a próxima pergunta
function nextQuestion() {
  currentQuestion++;
  // Verificar se há mais perguntas
  if (currentQuestion < questions.length) {
    renderQuestion();
  } else {
    // Finalizar o quiz e mostrar o resultado
    showResult();
  }
  // Desabilitar o botão 'Próxima Pergunta'
  disableNextButton();
}

// Função para mostrar o resultado do quiz
function showResult() {
  // Exibir a div de resultado
  showElement(document.querySelector('.result_box'));
  // Inserir a pontuação obtida na div apropriada
  // ...
}

// Função para mostrar um elemento
function showElement(element) {
  element.classList.remove('hidden');
}

// Função para esconder um elemento
function hideElement(element) {
  element.classList.add('hidden');
}

// Função para desabilitar o botão 'Próxima Pergunta'
function disableNextButton() {
  // Desabilitar o botão 'Próxima Pergunta'
  // ...
}

// Iniciar o aplicativo
window.onload = getQuestions();

// Seletores do DOM
const levelDisplay = document.getElementById("level-display");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const submitButton = document.getElementById("submit-button");
const resultContainer = document.getElementById("result-container");
const scoreMessage = document.getElementById("score-message");
const scoreElement = document.getElementById("score");
const totalQuestions = document.getElementById("total-questions");
const restartButton = document.getElementById("restart-button");
const quizContainer = document.getElementById("quiz-container");




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



