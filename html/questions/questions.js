const categoryEl = document.getElementById("category");
const typeEl = document.getElementById("type");
const fase = document.getElementById("fase");
const questionEl = document.getElementById("question");
const optionsListEl = document.getElementById("options-list");
const answerEl = document.getElementById("answer");

// Preencher os dados no DOM
categoryEl.textContent = questionData.category;
typeEl.textContent = questionData.type;
difficultyEl.textContent = questionData.difficulty;
questionEl.textContent = questionData.question;
answerEl.textContent = questionData.answer;

// Adicionar opções
questionData.options.forEach(option => {
  const li = document.createElement("li");
  li.textContent = option;
  optionsListEl.appendChild(li);
});