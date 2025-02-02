firebase.auth().onAuthStateChanged( (user) => {
    if (!user) {
        sessionStorage.clear;
        window.location.href = "../login/login.html";
    }
})
var user_UID = sessionStorage.userUid;
var status_profile = sessionStorage.profile_atualizar;
var score_total = sessionStorage.score_total;
var professor = sessionStorage.professor;

getCurrentUser();
showMenuProfessor();
showBody();

function getCurrentUser(){
    userService.findByUid(user_UID).then (user=>{
        if(user === undefined){
            sessionStorage.setItem("profile_atualizar",true);
        }else{
            sessionStorage.setItem("profile_atualizar",false);
            document.getElementById("nameUser").innerHTML = user.name;
            document.getElementById("score_total").innerHTML = user.score +" points";
            sessionStorage.setItem("score_total",user.score);
            const profiles = user.profiles;
            sessionStorage.setItem("admin",profiles.admin);
            sessionStorage.setItem("professor",profiles.admin);
            sessionStorage.setItem("aluno",profiles.admin);
        }
    }).catch(error => {
        console.log(getErrorMessage(error));
    });
}

function showBody(){ 
    var dados = document.getElementById("profile");
    dados.style.display = "none";   
    var menu_center = document.getElementById("menu-center");
    menu_center.style.display = "none"; 
    var form_perfil = document.getElementById("form-profile");
    form_perfil.style.display = "none"; 
    
    if(status_profile == "true"){
        status_profile =true;
    }else{
        status_profile =false;
    }
    
    if(!status_profile){
        dados.style.display = "inline";   
        menu_center.style.display = "inline"; 
    }else{
        form_perfil.style.display = "inline"; 
    }    
}

function showMenuProfessor(){
    if(professor === undefined){
        professor = false;
    }else{
        if (professor == "true"){
            professor = true;
        }else{
            professor = false;
        }
    }
    const menu = document.getElementById("menu-top");
    if(!professor){
        menu.style.display = "none";    
    }    
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
    userService.save(user_UID,user);
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
