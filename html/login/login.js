firebase.auth().onAuthStateChanged( (user) => {
    if (user) {
        sessionStorage.setItem("userUid", user.uid);
        window.location.href = "../home/home.html";
    }else{
        sessionStorage.clear;
        window.location.href = "../login/login.html";
    }
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
})

function onChangeEmail() {
    toggleButtonsDisable();
    toggleEmailErrors();
}

function onChangePassword() {
    toggleButtonsDisable();
    togglePasswordErrors();
}

function login() {
    firebase.auth().signInWithEmailAndPassword(
        form.email().value, form.password().value
    ).then((userCredential) => {
        hideLoading();
        console.log("Usuário logou:" + userCredential.user.uid);
        window.location.href = "../home/home.html";
    }).catch(error => {
        hideLoading();
        alert(getErrorMessage(error));
    });
}

function register() {
    window.location.href = "../register/register.html";
}

function recoverPassword() {
    firebase.auth().sendPasswordResetEmail(form.email().value).then(() => {
        hideLoading();
        alert('Email enviado com sucesso');
    }).catch(error => {
        hideLoading();
        alert(getErrorMessage(error));
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

function toggleEmailErrors() {
    const email = form.email().value;
    form.emailRequiredError().style.display = email ? "none" : "block";
    form.emailInvalidError().style.display = validateEmail(email) ? "none" : "block";
}

function togglePasswordErrors() {
    const password = form.password().value;
    form.passwordRequiredError().style.display = password ? "none" : "block";
}

function toggleButtonsDisable() {
    const emailValid = isEmailValid();
    form.recoverPasswordButton().disabled = !emailValid;

    const passwordValid = isPasswordValid();
    form.loginButton().disabled = !emailValid || !passwordValid;
}

function isEmailValid() {
    const email = form.email().value;
    if (!email) {
        return false;
    }
    return validateEmail(email);
}

function isPasswordValid() {
    return form.password().value ? true : false;
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