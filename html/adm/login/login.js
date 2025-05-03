firebase.auth().onAuthStateChanged( (User) => {
    if (User) {
        userService.findByUid(User.uid).then(user=>{
            if(user.admin){
                window.location.href = "../home/home.html";
            }else{
                window.location.href = "../../home/home.html";
            }
        }).catch(error => {
            console.log(error.message);
            window.location.href = "../../home/home.html";
        });
        window.location.href = "../../home/home.html";
    }
})

function login() {
    firebase.auth().signInWithEmailAndPassword(
        form.email().value, form.password().value
    ).then((userCredential) => {
        user = userCredential.user.auth.currentUser;
        console.log("Usuário logou:" + userCredential.user.uid);
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