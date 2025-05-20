// logout.js

/**
 * Função reutilizável para logout do Firebase Authentication.
 * Pode ser usada em qualquer página que precise sair da sessão.
 * Redireciona automaticamente para a tela de login após o logout.
 */

function logout() {
  firebase.auth().signOut()
    .then(() => {
      // Logout bem-sucedido → redirecionar para login
      console.log("Logout realizado com sucesso.");
      window.location.href = "/html/login/login.html";
    })
    .catch(error => {
      // Erro ao tentar fazer logout
      console.error("Erro ao fazer logout:", error);
      alert("Erro ao fazer logout! Tente novamente.");
    });
}