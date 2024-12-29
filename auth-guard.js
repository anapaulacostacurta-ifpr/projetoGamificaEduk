firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        window.location.href = "../../index.html";
    }
    const userUid = user.uid;
    document.getElementById("userUid").innerHTML = user.uid;
    userService.findByUid(userUid).then (user=>{
        document.getElementById("nameUser").innerHTML = "Olá, " + user.nickname;
    });
})