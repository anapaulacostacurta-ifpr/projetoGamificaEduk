function adm() {
    window.location.href = "../adm/conf/conf.html";
}

function quiz() {
    window.location.href = "../quiz/quiz.html";
}

function findNameUser(){
    const name = document.getElementById("nameUser");
    let user = userService.findByUid(firebase.auth().onAuthStateChanged())
    name.innerHTML = "Ola, " + user.nickname;
    console.log(user);
}

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../index.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../index.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}

window.onload = findNameUser;