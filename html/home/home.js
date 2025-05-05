firebase.auth().onAuthStateChanged((User) => {
    if (User) {
        userService.findByUid(User.uid).then(user=>{
            if(user.profile === "player"){
                window.location.href = "./home-player/home-player.html";
            }
            if(user.profile === "host"){
                window.location.href = "./home-host/home-host.html";
            }
        }).catch(error => {
            if(error.message === "01 - Não encontrado."){
                alert("Seu perfil precisa ser atualizado e ativado!Acesse o menu perfil.");
                window.location.href = "../profile/update-profile.html";
            }
            console.log(error);
        });
    }
})

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../login/login.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}


