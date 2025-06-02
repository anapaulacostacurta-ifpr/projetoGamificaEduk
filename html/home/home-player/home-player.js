// home-player.js

/**
 * Este script é responsável por carregar as informações do jogador autenticado
 * na Home do Jogador, validando seu perfil e exibindo avatar e nome na interface.
 */

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



