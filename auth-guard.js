firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        window.location.href = "../../index.html";
        console.log(user);
        console.log(userService.findByUid(user));
    }
})