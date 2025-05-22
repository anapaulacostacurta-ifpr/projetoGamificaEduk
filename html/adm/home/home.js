/**
 * Este script verifica se o usuário autenticado tem perfil de administrador.
 * Se for admin, carrega dados no DOM; caso contrário, redireciona.
 * Todos os caminhos utilizam `location.origin` para prevenir erros em subpastas.
 */

document.addEventListener("DOMContentLoaded", () => {
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      // Usuário não autenticado → redirecionar para login absoluto
      window.location.href = `${location.origin}/projetoGamificaEduk/html/login/login.html`;
      return;
    }

    // Busca dados do usuário autenticado no Firestore
    userService.findByUid(user.uid)
      .then(userData => {
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
      })
      .catch(error => {
        console.error("Erro ao buscar dados do usuário:", error);
        alert("Erro ao carregar seu perfil. Tente novamente.");
        window.location.href = `${location.origin}/projetoGamificaEduk/html/login/login.html`;
      });
});