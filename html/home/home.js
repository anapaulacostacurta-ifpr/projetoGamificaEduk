//Ranking Geral
var status_profile = sessionStorage.profile_atualizar;
var user_UID = sessionStorage.userUid;
var score_total = sessionStorage.score_total;

if(status_profile == "true"){
    status_profile =true;
}else{
    status_profile =false;
}

if(status_profile){
    var dados = document.getElementById("profile");
    dados.style.display = "none";   
    var menu_center = document.getElementById("menu-center");
    menu_center.style.display = "none"; 
}else{
    var form_perfil = document.getElementById("form-profile");
    form_perfil.style.display = "none"; 
}

const scorePoint = document.getElementById("score_total");
scorePoint.innerHTML = score_total +" points";

var professor = sessionStorage.professor;
if(professor === undefined){
    professor = false;
}else{
    if (professor == "true"){
        professor = true;
    }else{
        professor = false;
    }
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

function save_profile(){
 const name = document.getElementById("nome");
 const select = document.getElementById("profile");
 const profileUser = select.options[select.selectedIndex].value;
 
 var admin = false;
 var aluno = false;
 var professor = false;

 if(profileUser == "professor"){
    professor = true;
 }else{
    if (profileUser == "aluno"){
        aluno = true;
    }
    if (profileUser == "admin"){
        admin = true;
    }
 }
 var profile = {admin:admin, aluno: aluno, professor: professor};
 var user = {name: name, profile, score:0, status:false};
 userService.save(user_UID);
 alert("Aguarde seu perfil ser ativado pelo administrador!");
 logout();

}

function logout() {
    firebase.auth().signOut().then(() => {
        sessionStorage.clear();
        window.location.href = "../login/login.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}
