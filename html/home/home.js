//Ranking Geral
const scorePoint = document.getElementById("score_total");
scorePoint.innerHTML = "Score Total: "+sessionStorage.getItem("score_total");

function jogar() {
    window.location.href = "../play/play.html";
}

function logout() {
    firebase.auth().signOut().then(() => {
        sessionStorage.clear();
        window.location.href = "../../index.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}
