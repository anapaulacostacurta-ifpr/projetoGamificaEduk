function adm() {
    window.location.href = "../adm/conf/conf.html";
}

function quiz() {
    window.location.href = "../quiz/quiz.html";
}

function newQuestion() {
    window.location.href = "../adm/questions/questions.html";
}

function newBoardGame() {
    window.location.href = "../adm/boardgame/boardgame.html";
}

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../index.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}
