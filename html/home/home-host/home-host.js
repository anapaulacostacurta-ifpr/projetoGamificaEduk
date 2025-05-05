firebase.auth().onAuthStateChanged((User) => {
    if (User) {
        userService.findByUid(User.uid).then(user=>{
            if(user.profile === "host"){
                document.getElementById("nameUser").innerHTML = user.nickname;
                var avatar = user.avatar;
                document.getElementById("avatarUser").innerHTML ='<img class="img-fluid rounded-circle img-thumbnail" src="../../../assets/img/perfil/'+avatar+'.png" width="50" height="50"></img>';
                //document.getElementById("coins").innerHTML = user.coins;
            }else{
                alert("Seu perfil não tem acesso a essa página.");
            }
        }).catch(error => {
            if(error.message === "01 - Não encontrado."){
                alert("Seu perfil precisa ser atualizado e ativado!Acesse o menu perfil.");
                window.location.href = "./atualizacao.html";
            }
            console.log(error);
        });
    }
})

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../login/login.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}


