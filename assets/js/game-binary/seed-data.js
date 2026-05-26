/**
 * SCRIPT DE POPULAÇÃO INICIAL (SEED) - ANABITE BINÁRIOS
 * Executar uma única vez para testar os relatórios e rankings.
 */
function inicializarDadosFirebase() {
    const db = firebase.firestore();

    // 1. Dados iniciais de usuários (Coleção: users)
    const usuariosIniciais = [
        { uid: "player_ana", name: "Ana Silva Santos", nickname: "BitsQueen", profile: "player", host: "host_professor", avatar: "avatar1", state: true, admin: false, coins: 120 },
        { uid: "player_bruno", name: "Bruno Oliveira", nickname: "HexMaster", profile: "player", host: "host_professor", avatar: "avatar2", state: true, admin: false, coins: 90 },
        { uid: "player_carlos", name: "Carlos Eduardo Souza", nickname: "CtrlAltDefeat", profile: "player", host: "host_professor", avatar: "avatar1", state: true, admin: false, coins: 40 },
        { uid: "player_daniela", name: "Daniela Lima", nickname: "KernelPanic", profile: "player", host: "host_professor", avatar: "avatar2", state: true, admin: false, coins: 150 },
        { uid: "player_elton", name: "Elton John Silva", nickname: "ByteMe", profile: "player", host: "host_professor", avatar: "avatar1", state: false, admin: false, coins: 0 }
    ];

    // 2. Dados iniciais de desempenho no jogo de binários (Coleção: scoreboards)
    const scoreboardsIniciais = [
        { uid: "player_ana", name: "Ana Silva Santos", nickname: "BitsQueen", score: 120, phasesCompleted: 13, accuracy: 85, lastPlayed: firebase.firestore.FieldValue.serverTimestamp() },
        { uid: "player_bruno", name: "Bruno Oliveira", nickname: "HexMaster", score: 90, phasesCompleted: 10, accuracy: 72, lastPlayed: firebase.firestore.FieldValue.serverTimestamp() },
        { uid: "player_carlos", name: "Carlos Eduardo Souza", nickname: "CtrlAltDefeat", score: 40, phasesCompleted: 5, accuracy: 48, lastPlayed: firebase.firestore.FieldValue.serverTimestamp() },
        { uid: "player_daniela", name: "Daniela Lima", nickname: "KernelPanic", score: 150, phasesCompleted: 16, accuracy: 94, lastPlayed: firebase.firestore.FieldValue.serverTimestamp() }
    ];

    console.log("Iniciando carga de dados no Firestore...");

    // Salvando os Usuários
    const promisesUsers = usuariosIniciais.map(user => {
        return db.collection("users").doc(user.uid).set(user)
            .then(() => console.log(`Usuário ${user.nickname} inserido.`));
    });

    // Salvando as Pontuações/Métricas
    const promisesScores = scoreboardsIniciais.map(score => {
        return db.collection("scoreboards").doc(score.uid).set(score)
            .then(() => console.log(`Scoreboard de ${score.nickname} inserido.`));
    });

    // Aguarda todas as inserções finalizarem
    Promise.all([...promisesUsers, ...promisesScores])
        .then(() => {
            alert("🔥 Sucesso! Banco de dados do AnaBite populado com dados de números binários.");
        })
        .catch(error => {
            console.error("Erro ao popular o banco:", error);
            alert("Erro ao popular o banco. Verifique o console.");
        });
}

// Descomente a linha abaixo se quiser rodar automaticamente ao carregar o script
// inicializarDadosFirebase();