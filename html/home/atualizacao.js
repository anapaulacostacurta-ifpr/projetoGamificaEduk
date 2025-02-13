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

            var user = {uid: User.uid, name: name, profile:profileUser, score:0, status:false};
            try{
                userService.save(user).then(alert("Aguarde seu perfil ser ativado pelo administrador!"));
            }catch(error){
                alert(error.message);
            }
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



