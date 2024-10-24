// Função para ler o arquivo e criar o array de usuários
async function loaduser(file, user, pwd, funcao) {
  const response = await fetch(file);
  const text = await response.text();
  const lines = text.split('\n');

  lines.forEach(line => {
    const parts = line.split(';');
    if (parts.length === 4) {
      const login = parseInt(parts[0]);
      const senha = parseInt(parts[1]);
      const perfil = parseInt(parts[2]);  
      const nome = parseInt(parts[3]); 
    }
    if(user === login){
      if(senha === pwd){
        if(perfil === funcao){
          return true;
        }
      }
    }
    return false;
  });

  
}

//login Usuário
function login() {
   var usuario = document.getElementById("nome_login");
  var senha = document.getElementById("senha_login");
  var perfil = document.getElementById("perfil_usuario");
  if(loaduser('./assets/users.txt',usuario, senha, perfil)){
    window.location = './home.html';
  }else{
    window.alert("Usuário ou Senha inválido!");
  }
}

// Take over form submission
form.addEventListener("submit", (event) => {
  event.preventDefault();
  login();
});

