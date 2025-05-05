firebase.auth().onAuthStateChanged( (User) => {
    if (User) {
        window.location.href = "../home/home.html";
    }
})

function login() {
    const emailValid = isEmailValid();
    const passwordValid = isPasswordValid();
    if (emailValid || passwordValid){
        firebase.auth().signInWithEmailAndPassword(
            form.email().value, form.password().value
        ).then((userCredential) => {
            user = userCredential.user.auth.currentUser;
            console.log("Usuário logou:" + userCredential.user.uid);
        }).catch(error => {
            console.log(getErrorMessage(error));
        });
    }else{
        onChangeEmail();
        onChangePassword();
    }
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

function onChangeEmail() {
    toggleButtonsDisable();
    toggleEmailErrors();
}

function onChangePassword() {
    toggleButtonsDisable();
    togglePasswordErrors();
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
    const emailValid = !isEmailValid();
    form.recoverPasswordButton().disabled = emailValid;

    const passwordValid = !isPasswordValid();
    form.loginButton().disabled = emailValid || passwordValid;
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

function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
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