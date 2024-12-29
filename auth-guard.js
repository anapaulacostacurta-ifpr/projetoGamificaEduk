firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        window.location.href = "../../index.html";
    }
    const uid = user.uid; 
    userService.findByUid(uid).then (user=>{
        console.log("Nome:"+user.nickname);
        document.getElementById("nameUser").innerHTML = "Olá, " + user.nickname;
        return user;
    })
})