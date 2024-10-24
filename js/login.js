// Função para ler o arquivo e criar o array de usuários
async function loaduser(file, user, pwd, funcao) {
  const response = await fetch(file);
  const text = await response.text();
  const lines = text.split('\n');

  lines.forEach(line => {
    const parts = line.split(';');
    if (parts.length === 3) {
      const login = parseInt(parts[0]);
      const senha = parseInt(parts[1]);
      const perfil = parseInt(parts[2]);  
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
// Carregar os usuários
const user = loadGraph('./assets/users.txt');
