// Estado do Jogo
let db = firebase.firestore();
let currentUser = null;
let currentTargetDecimal = 0;
let phase = 1;
let coins = 0;
let totalAttempts = 0;
let correctAttempts = 0;

// Configurações do Caça-Palavras
const gridData = [
    ['B', 'I', 'T', 'X', 'Z', 'B'],
    ['Y', 'A', 'K', 'O', 'E', 'A'],
    ['T', 'X', 'U', 'M', 'R', 'S'],
    ['E', 'S', 'O', 'M', 'A', 'E'],
    ['Q', 'W', 'E', 'R', 'T', 'Y']
];

const targetWords = {
    "BIT":  [[0,0], [0,1], [0,2]],
    "BYTE": [[0,0], [1,0], [2,0], [3,0]],
    "BASE": [[0,5], [1,5], [2,5], [3,5]],
    "SOMA": [[3,1], [3,2], [3,3], [3,4]],
    "ZERO": [[0,4], [1,4], [2,4]], 
    "UM":   [[2,2], [2,3]]
};

let selectedCells = [];
let foundWords = [];

// Inicializa Autenticação e Carrega o Jogo
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        loadPlayerProgress();
        generateNewChallenge();
    } else {
        window.location.href = "../login/login.html";
    }
});

// Carrega progresso salvo do jogador logado
function loadPlayerProgress() {
    db.collection("scoreboards").doc(currentUser.uid).get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            coins = data.score || 0;
            phase = data.phasesCompleted || 1;
            document.getElementById("player-coins").innerText = coins;
            document.getElementById("current-phase").innerText = phase;
        }
    });
}

// Inverte o estado do bit graficamente e recalcula o preview decimal
function toggleBit(bitId) {
    const btn = document.getElementById(bitId);
    if (btn.innerText === "0") {
        btn.innerText = "1";
        btn.classList.replace("btn-outline-dark", "btn-dark");
    } else {
        btn.innerText = "0";
        btn.classList.replace("btn-dark", "btn-outline-dark");
    }
    updatePreview();
}

// Atualiza a visualização em tempo real da conversão do aluno
function updatePreview() {
    const b3 = document.getElementById("bit3").innerText;
    const b2 = document.getElementById("bit2").innerText;
    const b1 = document.getElementById("bit1").innerText;
    const b0 = document.getElementById("bit0").innerText;
    
    const binaryStr = b3 + b2 + b1 + b0;
    const decimalVal = parseInt(binaryStr, 2);

    document.getElementById("binary-preview").innerText = binaryStr;
    document.getElementById("decimal-preview").innerText = decimalVal;
}

// Gera um novo número randômico dependendo da fase atual
function generateNewChallenge() {
    ['bit3', 'bit2', 'bit1', 'bit0'].forEach(id => {
        const btn = document.getElementById(id);
        btn.innerText = "0";
        btn.classList.remove("btn-dark");
        btn.classList.add("btn-outline-dark");
    });
    
    let max = phase <= 2 ? 7 : 15; 
    currentTargetDecimal = Math.floor(Math.random() * max) + 1;
    
    document.getElementById("decimal-target").innerText = currentTargetDecimal;
    updatePreview();
}

// Valida a resposta digitada pelo estudante
function checkAnswer() {
    totalAttempts++;
    const currentDecimalPreview = parseInt(document.getElementById("decimal-preview").innerText);
    const feedback = document.getElementById("game-feedback");
    
    feedback.classList.remove("d-none", "alert-success", "alert-danger");

    if (currentDecimalPreview === currentTargetDecimal) {
        correctAttempts++;
        coins += 10; 
        phase++; 
        
        feedback.innerText = `🎉 Excelente! Você decodificou o número! +10 Moedas adicionadas.`;
        feedback.classList.add("alert-success");
        
        document.getElementById("player-coins").innerText = coins;
        document.getElementById("current-phase").innerText = phase;

        saveScoreboardData();
        setTimeout(generateNewChallenge, 2000);
    } else {
        feedback.innerText = `❌ Incorreto. Lembre-se dos pesos de cada bit (8-4-2-1). Tente novamente!`;
        feedback.classList.add("alert-danger");
    }
}

// Persiste o Score e Aproveitamento no Firestore
function saveScoreboardData() {
    const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 100;
    
    db.collection("users").doc(currentUser.uid).get().then(userDoc => {
        let nickname = "Player Anonimo";
        let name = "Estudante";
        if(userDoc.exists) {
            nickname = userDoc.data().nickname || userDoc.data().name || "Player Anonimo";
            name = userDoc.data().name || "Estudante";
        }

        db.collection("scoreboards").doc(currentUser.uid).set({
            uid: currentUser.uid,
            nickname: nickname,
            name: name,
            score: coins,
            phasesCompleted: phase,
            accuracy: accuracy,
            lastPlayed: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true }).then(() => {
            console.log("Pontuação sincronizada com sucesso!");
        });
    });
}

/* ==========================================
   MÓDULO DE REQUISITOS EXTRA: CAÇA-PALAVRAS
   ========================================== */
function buildWordSearchGrid() {
    const table = document.getElementById("wordsearch-grid");
    if (!table) return;

    let tableHtml = "";
    for (let r = 0; r < gridData.length; r++) {
        tableHtml += "<tr>";
        for (let c = 0; c < gridData[r].length; c++) {
            tableHtml += `<td id="cell-${r}-${c}" onclick="selectCell(${r}, ${c})">${gridData[r][c]}</td>`;
        }
        tableHtml += "</tr>";
    }
    table.innerHTML = tableHtml;
}

function selectCell(r, c) {
    const cellId = `cell-${r}-${c}`;
    const cellElement = document.getElementById(cellId);
    
    const index = selectedCells.findIndex(cell => cell.r === r && cell.c === c);
    
    if (index >= 0) {
        selectedCells.splice(index, 1);
        cellElement.classList.remove("bg-primary");
    } else {
        selectedCells.push({ r, c });
        cellElement.classList.add("bg-primary");
    }

    checkSelectedWord();
}

function checkSelectedWord() {
    for (let word in targetWords) {
        if (foundWords.includes(word)) continue;

        const coords = targetWords[word];
        let match = coords.every(coord => 
            selectedCells.some(selected => selected.r === coord[0] && selected.c === coord[1])
        );

        if (match) {
            const wordBadge = document.getElementById(`w-${word}`);
            if (wordBadge) {
                wordBadge.classList.replace("bg-outline-secondary", "bg-success");
                wordBadge.classList.add("text-white", "text-decoration-line-through");
            }
            
            coords.forEach(coord => {
                const cell = document.getElementById(`cell-${coord[0]}-${coord[1]}`);
                cell.classList.remove("bg-primary");
                cell.classList.add("bg-success");
                cell.style.pointerEvents = "none";
            });

            foundWords.push(word);
            selectedCells = [];
        }
    }

    if (foundWords.length === Object.keys(targetWords).length) {
        document.getElementById("wordsearch-feedback").classList.remove("d-none");
    }
}

/* ==========================================
   MÓDULO DE REQUISITOS EXTRA: QUIZ
   ========================================== */
function validarQuiz() {
    const questions = document.querySelectorAll(".quiz-question");
    let totalQuestions = questions.length;
    let correctAnswersCount = 0;
    let answeredCount = 0;

    questions.forEach(q => q.classList.remove("text-success", "text-danger"));

    questions.forEach((q, index) => {
        const questionNum = index + 1;
        const selectedRadio = q.querySelector(`input[name="q${questionNum}"]:checked`);
        const correctAnswer = q.getAttribute("data-correct");

        if (selectedRadio) {
            answeredCount++;
            if (selectedRadio.value === correctAnswer) {
                correctAnswersCount++;
                q.classList.add("text-success");
            } else {
                q.classList.add("text-danger");
            }
        }
    });

    const feedback = document.getElementById("quiz-feedback");
    if (answeredCount < totalQuestions) {
        feedback.className = "alert alert-warning mt-3 p-2 small";
        feedback.innerText = "⚠️ Responda a todas as perguntas antes de enviar!";
        feedback.classList.remove("d-none");
        return;
    }

    feedback.classList.remove("d-none", "alert-success", "alert-danger", "alert-warning");

    if (correctAnswersCount === totalQuestions) {
        feedback.className = "alert alert-success mt-3 p-2 small";
        feedback.innerHTML = `🎉 <strong>Gabaritou!</strong> +30 Moedas adicionadas à sua carteira!`;
        document.getElementById("btn-submit-quiz").disabled = true;
        
        coins += 30;
        document.getElementById("player-coins").innerText = coins;
        saveScoreboardData();
    } else {
        feedback.className = "alert alert-danger mt-3 p-2 small";
        feedback.innerHTML = `❌ Você acertou ${correctAnswersCount} de ${totalQuestions}. Revise e tente de novo!`;
    }
}

/* ==========================================
   MÓDULO DE RELATÓRIOS E RANKINGS (CORRIGIDO)
   ========================================== */
function loadReports() {
    const rankingTableBody = document.getElementById("ranking-table-body");
    const performanceTableBody = document.getElementById("performance-table-body");

    rankingTableBody.innerHTML = `<tr><td colspan="3" class="text-center">Carregando dados...</td></tr>`;
    performanceTableBody.innerHTML = `<tr><td colspan="3" class="text-center">Carregando dados...</td></tr>`;

    // 1. Atualização Corrigida do Ranking Geral
    db.collection("scoreboards")
      .orderBy("score", "desc")
      .limit(10)
      .get()
      .then((querySnapshot) => {
          let rowsHtml = "";
          let position = 1;
          
          querySnapshot.forEach((doc) => {
              const data = doc.data();
              rowsHtml += `
                <tr>
                    <td><strong>${position}°</strong></td>
                    <td>${data.nickname || "Anonimo"}</td>
                    <td><span class="badge bg-warning text-dark">${data.score || 0} 🪙</span></td>
                </tr>`;
              position++;
          });
          
          // CORREÇÃO: Usando estritamente a variável correta mape