// Escuta mudanças na autenticação
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // Busca dados do usuário autenticado
        userService.findByUid(user.uid)
            .then(userData => {
                switch (userData.profile) {
                    case "player":
                        window.location.href = "./home-player/home-player.html";
                        break;
                    case "host":
                        window.location.href = "./home-host/home-host.html";
                        break;
                    default:
                        alert("Perfil desconhecido.");
                        break;
                }
            })
            .catch(error => {
                // Se o erro for perfil não encontrado
                if (error.message === "01 - Não encontrado.") {
                    alert("Seu perfil precisa ser atualizado e ativado! Acesse o menu perfil.");
                    window.location.href = "../profile/update-profile.html";
                } else {
                    console.error("Erro ao buscar perfil:", error);
                }
            });
    }
});

// Realiza logout do Firebase
function logout() {
    firebase.auth().signOut()
        .then(() => {
            window.location.href = "../login/login.html";
        })
        .catch(() => {
            alert("Erro ao fazer logout!");
        });
}



