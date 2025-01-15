firebase.auth().onAuthStateChanged( (user) => {
    const userUid = user.uid;
    document.getElementById("userUid").value = user.uid;
    userService.findByUid(userUid).then (user=>{
        document.getElementById("nameUser").innerHTML = "Olá, " + user.nickname;
    }).catch(error => {
        alert(error);
    });
})