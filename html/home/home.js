//Ranking Geral
const scorePoint = document.getElementById("score_total");
scorePoint.innerHTML = sessionStorage.getItem("score_total") +" points";

var professor = sessionStorage.professor;
if (professor == "true"){
    professor = true;
}else{
    professor = false;
}

const menu = document.getElementById("professor");
if(!professor){
    menu.style.display = "none";    
}


function jogar() {
    window.location.href = "../play/play.html";
}

function ranking_geral() {
    window.location.href = "../ranking/geral/geralranking.html";
}

function ranking_nivel() {
    window.location.href = "../ranking/level/levelranking.html";
}

function extrato() {
    window.location.href = "../extrato/extrato.html";
}

function logout() {
    firebase.auth().signOut().then(() => {
        sessionStorage.clear();
        window.location.href = "../login/login.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}
