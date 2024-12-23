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

// Iniciar o aplicativo
window.onload = getQuestions();
