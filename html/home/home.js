// home.js

/**
 * Este script detecta o usuário autenticado e redireciona para a home correta com base no perfil (player, host).
 * Usa location.origin para garantir caminhos absolutos consistentes, mesmo em subpastas ou em produção (GitHub Pages).
 */

document.addEventListener("DOMContentLoaded", () => {
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      // Usuário não autenticado → redirecionar para login absoluto
      window.location.href = `${location.origin}/projetoGamificaEduk/html/login/login.html`;
      return;
    }

    // Busca dados do usuário autenticado no Firestore
    userService.findByUid(user.uid).then(userData => {
        // Redirecionamento com base no perfil
        const base = `${location.origin}/projetoGamificaEduk/html/home`;

        switch (userData.profile) {
          case "player":
            window.location.href = `${base}/home-player/home-player.html`;
            break;
          case "host":
            window.location.href = `${base}/home-host/home-host.html`;
            break;
          default:
            alert("Perfil desconhecido. Acesso negado.");
            window.location.href = `${location.origin}/projetoGamificaEduk/html/login/login.html`;
            break;
        }
      }).catch(error => {
        console.error("Erro ao buscar dados do usuário:", error);
        alert("Erro ao carregar seu perfil. Tente novamente.");
        window.location.href = `${location.origin}/projetoGamificaEduk/html/login/login.html`;
      });
  })
})
