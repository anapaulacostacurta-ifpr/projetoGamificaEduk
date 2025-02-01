firebase.auth().onAuthStateChanged( (user) => {
    const userUid = user.uid;
    sessionStorage.setItem("userUid", user.uid);
    sessionStorage.setItem("nameUser",user.nickname);
    
    userService.findByUid(userUid).then (user=>{
        document.getElementById("nameUser").innerHTML = "Olá, " + user.nickname;
        sessionStorage.setItem("score_total",user.score);
        const profiles = user.profiles;
        sessionStorage.setItem("admin",profiles.admin);
        sessionStorage.setItem("professor",profiles.admin);
        sessionStorage.setItem("aluno",profiles.admin);
    }).catch(error => {
        console.log(error);
    });
})

