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
  console.log(question);
  // Inserir o texto da pergunta na div apropriada
  const questionElement = document.querySelector('.que_text');
  questionElement.innerText = question.text;
  console.log (questionElement.innerHTML)
  console.log (question.text);

  // Inserir as opções de resposta na div apropriada
  const optionsElement = document.querySelector('.option_list');
  //optionsElement.innerHTML = ''; // Limpar opções anteriores

  question.options.forEach((option, index) => {
    const optionButton = document.createElement('button');
    optionButton.classList.add('option'); // Adicionar classe de estilo para as opções
    optionButton.innerText = option; // Texto da opção
    optionButton.dataset.index = index; // Adicionar um índice para referência

    // Habilitar evento de clique na opção
    optionButton.addEventListener('click', () => handleOptionClick(index));

    // Adicionar o botão à lista de opções
    optionsElement.appendChild(optionButton);
  });
}

// Função para lidar com o clique em uma opção
function handleOptionClick(selectedIndex) {
  console.log('Opção ${selectedIndex} clicada!');
  // Aqui você pode adicionar lógica para verificar se a resposta está correta
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
window.onload = getQuestions;
