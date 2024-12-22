// ID do documento a ser carregado
const questionUid = document.getElementById("questionUid"); // Substitua pelo UID do documento desejado


// Elementos do DOM
const categoryEl = document.getElementById("category");
const typeEl = document.getElementById("type");
const level = document.getElementById("level");
const questionEl = document.getElementById("question");
const optionsListEl = document.getElementById("options-list");
const answerEl = document.getElementById("answer");

// Função para carregar os dados e preencher o HTML
questionService.findByUid(questionUid).then(questionData => {
  if (!questionData) {
    console.error("Documento não encontrado!");
    return;
  }

  // Preencher os elementos
  categoryEl.textContent = questionData.category;
  typeEl.textContent = questionData.type;
  level.textContent = questionData.level;
  questionEl.textContent = questionData.question;
  answerEl.textContent = questionData.answer;

  // Adicionar as opções à lista
  optionsListEl.innerHTML = ""; // Limpar qualquer conteúdo anterior
  questionData.options.forEach(option => {
    const li = document.createElement("li");
    li.textContent = option;
    optionsListEl.appendChild(li);
  });
}).catch(error => {
  console.error("Erro ao buscar os dados:", error);
});