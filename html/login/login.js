firebase.auth().onAuthStateChanged( (user) => {
    if (user) {
        window.location.href = "../home/home.html";
    }
})

function login() {
    var user_UID;
    firebase.auth().signInWithEmailAndPassword(
        form.email().value, form.password().value
    ).then((userCredential) => {
        user_UID = userCredential.user.auth.currentUser.uid;
        sessionStorage.setItem("userUid", user_UID);
        console.log("Usuário logou:" + userCredential.user.uid);
        window.location.href = "../home/home.html";
    }).catch(error => {
        console.log(getErrorMessage(error));
    });
    getCurrentUser(user_UID);
}

function getCurrentUser(user_UID){
    if (sessionStorage.User === undefined) {
        return userService.findByUid(user_UID).then (user=>{
            if(user === undefined){
                sessionStorage.setItem("profile_atualizar",true);
            }else{
                sessionStorage.setItem("profile_atualizar",false);
                setUser(user);
                getUser();
            }
        }).catch(error => {
            console.log(error);
        });
    }else{
        return getUser();
    }
}

function setUser(User){
    let UserString = JSON.stringify(User);
    sessionStorage.setItem('User', UserString);
}
  
function getUser(){
    let userString = sessionStorage.User;
    let user;
    if(!(userString === undefined)){
        user = JSON.parse(userString);
    }
    console.log(user);
    return user;
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