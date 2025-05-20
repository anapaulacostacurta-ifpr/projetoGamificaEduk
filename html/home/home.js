// home.js

/**
 * Verifica o estado de autenticação do usuário com Firebase.
 * Redireciona para a home específica com base no perfil (player, host).
 * Se o perfil não estiver cadastrado, redireciona para atualização de perfil.
 */

// Escuta mudanças na autenticação
document.addEventListener("DOMContentLoaded", () => {
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      // Se não houver usuário autenticado, redireciona para login
      window.location.href = "../login/login.html";
      return;
    }

    // Busca dados do usuário autenticado no Firestore
    userService.findByUid(user.uid)
      .then(userData => {
        // Redireciona de acordo com o perfil do usuário
        switch (userData.profile) {
          case "player":
            window.location.href = "./home-player/home-player.html";
            break;
          case "host":
            window.location.href = "./home-host/home-host.html";
            break;
          default:
            alert("Perfil desconhecido.");
            break;
        }
      }).catch(error => {
        console.error("Erro ao buscar dados do usuário:", error);
        alert("Erro ao carregar seu perfil. Tente novamente.");
        window.location.href = "../../login/login.html";
      });
  });
});



