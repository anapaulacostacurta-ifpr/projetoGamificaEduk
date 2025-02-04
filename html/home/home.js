firebase.auth().onAuthStateChanged( (user) => {
    if (!user) {
        sessionStorage.clear;
        window.location.href = "../login/login.html";
    }
})

var user_UID = sessionStorage.userUid;
var User = getCurrentUser(user_UID).then(showBody());

function showBody(){ 
    var menu_center = document.getElementById("menu-center");
    var form_perfil = document.getElementById("form-profile");
    var dados = document.getElementById("profile");
    var status_profile = sessionStorage.profile_atualizar;
    if(status_profile == "true"){
        status_profile =true;
    }else{
        status_profile =false;
    }
    if(!status_profile){
        dados.style.display = "inline";   
        menu_center.style.display = "inline"; 
        form_perfil.style.display = "none"; 
    }else{
        dados.style.display = "none";   
        menu_center.style.display = "none"; 
        form_perfil.style.display = "inline"; 
    } 

    document.getElementById("nameUser").innerHTML = sessionStorage.User.name;
    document.getElementById("score_total").innerHTML = sessionStorage.User.score +" points";
    var professor = sessionStorage.sessionStorage.User.profileUser.professor;
    if(professor === undefined){
        professor = false;
    }else{
        if (professor == "true"){
            professor = true;
        }else{
            professor = false;
        }
    }
    if(!professor){
        document.getElementById("menu_top").style.display = "none";    
    }else{
        document.getElementById("menu_top").style.display = "inline"; 
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

async function getCurrentUser(user_UID){
    if (sessionStorage.User === undefined) {
        return await userService.findByUid(user_UID).then (user=>{
            if(user === undefined){
                sessionStorage.setItem("profile_atualizar",true);
            }else{
                sessionStorage.setItem("profile_atualizar",false);
                setUser(user);
            }
        }).catch(error => {
            console.log(error);
        });
    }else{
        return getUser();
    }
}

function setUser(User){
    let UserString = JSON.stringify(User);
    sessionStorage.setItem('User', UserString);
  }
  
function getUser(){
    let UserString = sessionStorage.User;
    let User;
    if(!(UserString === undefined)){
        User = JSON.parse(UserString);
    }
    console.log(User);
    return User;
}




