firebase.auth().onAuthStateChanged((User) => {
    if (!User) {
        window.location.href = "../login/login.html";
    }else{
        document.getElementById("form-profile").addEventListener("submit", function(event) {
        event.preventDefault();
            const name = document.getElementById("nome").value;
            const select = document.getElementById("profile");
            const profileUser = select.options[select.selectedIndex].value;
            
            var profile;

            if(profileUser == "professor"){
                profile = {admin:false, aluno: false, professor: true};
            }else{
                if (profileUser == "aluno"){
                    profile = {admin:false, aluno: true, professor: false};
                }
                if (profileUser == "admin"){
                    profile = {admin:true, aluno: false, professor: false};
                }
            }
            var user = {name: name, profile, score:0, status:false};
            usersService.save(User.uid,user).then(alert("Aguarde seu perfil ser ativado pelo administrador!"));
            logout();
        });
    }
});

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../login/login.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}

function voltar(){
    window.location.href = "home.html";
}



