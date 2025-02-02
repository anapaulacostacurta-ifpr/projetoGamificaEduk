firebase.auth().onAuthStateChanged( (user) => {
    if (user) {
        sessionStorage.setItem("userUid", user.uid);
        userService.findByUid(uid).then (user=>{
            if(user === undefined){
                sessionStorage.setItem("profile_atualizar",true);
            }else{
                sessionStorage.setItem("profile_atualizar",false);
                document.getElementById("nameUser").innerHTML = user.name;
                sessionStorage.setItem("score_total",user.score);
                const profiles = user.profiles;
                sessionStorage.setItem("admin",profiles.admin);
                sessionStorage.setItem("professor",profiles.admin);
                sessionStorage.setItem("aluno",profiles.admin);
            }
        }).catch(error => {
            console.log(getErrorMessage(error));
        });
        window.location.href = "../home/home.html";
    }
})

function login() {
    firebase.auth().signInWithEmailAndPassword(
        form.email().value, form.password().value
    ).then((userCredential) => {
        userService.findByUid(userCredential.uid).then (user=>{
            if(user === undefined){
                sessionStorage.setItem("profile_atualizar",true);
            }else{
                sessionStorage.setItem("profile_atualizar",false);
                document.getElementById("nameUser").innerHTML = user.name;
                sessionStorage.setItem("score_total",user.score);
                const profiles = user.profiles;
                sessionStorage.setItem("admin",profiles.admin);
                sessionStorage.setItem("professor",profiles.admin);
                sessionStorage.setItem("aluno",profiles.admin);
            }
        console.log("Usuário logou:" + userCredential.user.uid);
        window.location.href = "../home/home.html";
    }).catch(error => {
        console.log(getErrorMessage(error));
    });
});
}

function register() {
    window.location.href = "../register/register.html";
}

function recoverPassword() {
    firebase.auth().sendPasswordResetEmail(form.email().value).then(() => {
        alert('Email enviado com sucesso');
    }).catch(error => {
        console.log(getErrorMessage(error));
    });
}

function getErrorMessage(error) {
    if (error.code == "auth/user-not-found") {
        return "Usuário nao encontrado";
    }
    if (error.code == "auth/wrong-password") {
        return "Senha inválida";
    }
    return error.message;
}

const form = {
    email: () => document.getElementById("email"),
    emailInvalidError: () => document.getElementById("email-invalid-error"),
    emailRequiredError: () => document.getElementById("email-required-error"),
    loginButton: () => document.getElementById("login-button"),
    password: () => document.getElementById("password"),
    passwordRequiredError: () => document.getElementById("password-required-error"),
    recoverPasswordButton: () => document.getElementById("recover-password-button"),
} 