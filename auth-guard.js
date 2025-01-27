firebase.auth().onAuthStateChanged( (user) => {
    const userUid = user.uid;
    sessionStorage.setItem("userUid", user.uid);
    sessionStorage.setItem("nameUser",user.nickname);
    sessionStorage.setItem("score_total",user.score);
    userService.findByUid(userUid).then (user=>{
        document.getElementById("nameUser").innerHTML = "Olá, " + user.nickname;
    }).catch(error => {
        console.log(error);
    });
})