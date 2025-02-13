firebase.auth().onAuthStateChanged((User) => {
    if (!User) {
        window.location.href = "../login/login.html";
    }else{
        userService.findByUid(User.uid).then(user=>{
            if(user === undefined){
                document.getElementById("btnJogar").style.display = "none";
                alert("Seu perfil precisa ser atualizado e ativado!Acesse o menu perfil.");
                window.location.href = "./atualizacao.html";
            }else{
                document.getElementById("nameUser").innerHTML = user.nickname;
                var avatar = user.avatar;
                document.getElementById("avatarUser").innerHTML ='<img class="img-fluid rounded-circle img-thumbnail" src="../../assets/img/perfil/'+avatar+'.png" width="50" height="50"></img>';
                document.getElementById("score_total").innerHTML = user.score;
            }
        }).catch(error => {
            console.log(error);
        });
    }
})

function jogar() {
    window.location.href = "../play/play.html";
}

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../login/login.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}


