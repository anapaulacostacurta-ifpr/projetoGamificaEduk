// Estado do Jogo
let db = firebase.firestore();
let currentUser = null;
let currentTargetDecimal = 0;
let phase = 1;
let coins = 0;
let totalAttempts = 0;
let correctAttempts = 0;

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
    // Reseta botões para 0
    ['bit3', 'bit2', 'bit1', 'bit0'].forEach(id => {
        const btn = document.getElementById(id);
        btn.innerText = "0";
        btn.classList.remove("btn-dark");
        btn.classList.add("btn-outline-dark");
    });
    
    // Define limites baseados na fase (Gamificação por dificuldade)
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
        coins += 10; // Recompensa por acerto
        phase++; // Avança fase de narrativa
        
        feedback.innerText = `🎉 Excelente! Você decodificou o número! +10 Moedas adicionadas.`;
        feedback.classList.add("alert-success");
        
        // Atualiza interface do usuário local
        document.getElementById("player-coins").innerText = coins;
        document.getElementById("current-phase").innerText = phase;

        // Salva dados no banco de dados para os relatórios
        saveScoreboardData();
        setTimeout(generateNewChallenge, 2000);
    } else {
        feedback.innerText = `❌ Incorreto. Lembre-se dos pesos de cada bit (8-4-2-1). Tente novamente!`;
        feedback.classList.add("alert-danger");
    }
}

// Persiste o Score e Aproveitamento no Firestore
function saveScoreboardData() {
    const accuracy = Math.round((correctAttempts / totalAttempts) * 100);
    
    // Busca o nickname do perfil do usuário para exibir corretamente nos rankings
    db.collection("users").doc(currentUser.uid).get().then(userDoc => {
        let nickname = "Player Anonimo";
        let name = "Estudante";
        if(userDoc.exists) {
            nickname = userDoc.data().nickname || userDoc.data().name;
            name = userDoc.data().name;
        }

        db.collection("scoreboards").doc(currentUser.uid).set({
            uid: currentUser.uid,
            nickname: nickname,
            name: name,
            score: coins,
            phasesCompleted: phase,
            accuracy: accuracy,
            lastPlayed: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    });
}

/* ==========================================
   MÓDULO DE RELATÓRIOS E RANKINGS (FIRESTORE)
   ========================================== */
function loadReports() {
    const rankingTableBody = document.getElementById("ranking-table-body");
    const performanceTableBody = document.getElementById("performance-table-body");

    rankingTableBody.innerHTML = `<tr><td colspan="3" class="text-center">Carregando dados...</td></tr>`;
    performanceTableBody.innerHTML = `<tr><td colspan="3" class="text-center">Carregando dados...</td></tr>`;

    // Consulta para o Ranking Geral (Ordenado por Maior Score de Moedas)
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
                    <td>${data.nickname}</td>
                    <td><span class="badge bg-warning text-dark">${data.score} 🪙</span></td>
                </tr>`;
              position++;
          });
          rankingTableBody.innerHTML = rowsHtml || `<tr><td colspan="3" class="text-center">Nenhum registro ainda.</td></tr>`;
      }).catch(err => console.error("Erro ao carregar ranking: ", err));

    // Consulta para o Painel de Desempenho / Professor (Ordenado por Nome do Estudante)
    db.collection("scoreboards")
      .orderBy("name", "asc")
      .get()
      .then((querySnapshot) => {
          let rowsHtml = "";
          querySnapshot.forEach((doc) => {
              const data = doc.data();
              // Determina a cor com base na taxa de acerto do aluno técnico
              let badgeColor = data.accuracy >= 70 ? "bg-success" : (data.accuracy >= 50 ? "bg-warning text-dark" : "bg-danger");
              
              rowsHtml += `
                <tr>
                    <td>${data.name} <small class="text-muted">(${data.nickname})</small></td>
                    <td><span class="badge ${badgeColor}">${data.accuracy}% de precisão</span></td>
                    <td><span class="text-primary fw-bold">${data.phasesCompleted - 1}</span> fases salvas</td>
                </tr>`;
          });
          performanceTableBody.innerHTML = rowsHtml || `<tr><td colspan="3" class="text-center">Nenhum dado analítico encontrado.</td></tr>`;
      }).catch(err => console.error("Erro ao carregar métricas: ", err));
}