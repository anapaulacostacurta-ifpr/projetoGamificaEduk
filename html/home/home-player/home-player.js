// home-player.js

/**
 * Este script é responsável por carregar as informações do jogador autenticado
 * na Home do Jogador, validando seu perfil e exibindo avatar e nome na interface.
 */

// Seletores de elementos de feedback
const alertSuccess = document.getElementById("alert_sucesso");
const alertError = document.getElementById("alert_error");

document.addEventListener("DOMContentLoaded", () => {
  // Escuta mudanças no estado de autenticação
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      // Se não estiver logado, redireciona para o login
      window.location.href = `${location.origin}/projetoGamificaEduk/html/login/login.html`;
      return;
    }

    // Busca os dados do usuário logado no Firestore
    userService.findByUid(user.uid)
      .then(userData => {
        // Verifica se o perfil é jogador
        if (userData.profile === "player") {
          // Exibe nome e avatar
          const nameUserElement = document.getElementById("nameUser");
          const avatarUserElement = document.getElementById("avatarUser");

          if (nameUserElement) {
            nameUserElement.textContent = userData.nickname;
          }

          if (avatarUserElement) {
            const avatarPath = `${location.origin}/projetoGamificaEduk/assets/img/perfil/${userData.avatar}.png`;
            avatarUserElement.innerHTML = `
              <img 
                src="${avatarPath}" 
                class="img-fluid rounded-circle img-thumbnail" 
                alt="Avatar de ${userData.nickname}" 
                width="50" 
                height="50"
              />`;
          }

        } else {
          // Usuário com perfil diferente → acesso negado
          alert("Seu perfil não tem acesso a essa página.");
          window.location.href = `${location.origin}/projetoGamificaEduk/html/login/login.html`;
        }
      })
      .catch(error => {
        console.error("Erro ao buscar dados do usuário:", error);
        alert("Erro ao carregar seu perfil. Tente novamente.");
        window.location.href = `${location.origin}/projetoGamificaEduk/html/login/login.html`;
      });
  });
});



/**
 * Exibe mensagem de sucesso formatada.
 * @param {string} message - Texto de sucesso a exibir.
 */
function showSuccess(message) {
  alertSuccess.classList.add("show");
  alertSuccess.classList.add("alert-dismissible");
  alertSuccess.innerHTML = `
    <button id="btn-close-success" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"><span aria-hidden="true">&times;</span></button>
    <strong>${message}</strong>
  `;

  var bsAlertSuccess = new bootstrap.Alert(alertSuccess);
  bootstrap.Alert.getInstance(bsAlertSuccess);
  alertSuccess.alert();
}

/**
 * Exibe mensagem de erro formatada.
 * @param {string} message - Texto de erro a exibir.
 */
function showError(message) {
  ;
  alertError.classList.add("show");
  alertError.classList.add("alert-dismissible");
  alertError.innerHTML = `
    <button id="btn-close-error" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    <strong>${message}</strong>
  `;
  var bsAlertError = new bootstrap.Alert(alertError)
  bootstrap.Alert.getInstance(bsAlertError);
  alertError.alert();
}


window.addEventListener('offline', () => {
  showError("Você está offline. Verifique sua conexão com a internet.");
});

window.addEventListener('online', () => {
  showSuccess("Conexão restaurada. Você pode prosseguir.");
});
