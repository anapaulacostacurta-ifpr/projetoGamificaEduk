firebase.auth().onAuthStateChanged( (user) => {
  if (!user) {
      window.location.href = "../login/login.html";
  }
  const uid = user.uid; 
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
      return user;
  }).catch(error => {
      console.log(getErrorMessage(error));
  });
})

//Ranking Geral
const scorePoint = document.getElementById("score_total");
scorePoint.innerHTML = sessionStorage.getItem("score_total") +" points";

var admin = sessionStorage.admin;
if (admin == "true"){
    admin = true;
}else{
    admin = false;
}

const menu = document.getElementById("admin");
if(!admin){
    menu.style.display = "none";    
}

// Captura o evento de envio do formulário
document.getElementById("play-form").addEventListener("submit", function(event) {
  event.preventDefault();

  // Captura os dados do formulário
  const boardgame_id = document.getElementById("boardgameid").value;
  const user_UID = sessionStorage.userUid;
  
  boardgamesService.getBoardGameByID(boardgame_id).then((boardgames) => {
    boardgames.forEach(boardgame => {
      console.log(boardgames);
      const state  = boardgame.state;
      var players = boardgame.players;
      
        let score = 0;
        if (players === undefined){
          players = new Array();
          players[0] = {user_UID:user_UID,score_round:0};
          boardgamesService.addPlayers(boardgame_id, {players});
        }else{
          //variável para verficar se o jogador já entrou no tabuleiro
          let isOnPlayer = false;
          
          players.forEach(player => {
            if(player.user_UID == user_UID){
              isOnPlayer = true;
              score = player.score_round;
            }
          });
          if (isOnPlayer){
            alert('Você já entrou no jogo!Fale com o professor!');
          }else{
            players.push({user_UID:user_UID,score_round:0});
            boardgamesService.addPlayers(boardgame_id, {players});
          }
        }
        setBoardGame(boardgame);
        sessionStorage.setItem("boardgame_id",boardgame_id);
        sessionStorage.setItem("level",boardgame.level);
        sessionStorage.setItem("score_round",score);
      });
      window.location.href = "./menu.html";
    }).catch( (error) => {
      alert(error);
      document.getElementById("play-form").reset();
    })
  });

function setBoardGame(boardgame){
  let boardgameString = JSON.stringify(boardgame);
  sessionStorage.setItem('boardgame', boardgameString);
}

function getBoardgame(){
  let boardgameString = sessionStorage.boardgame;
  let boardgame = JSON.parse(boardgameString);
  console.log(boardgame);
  return boardgame;
}

function voltar(){
  window.location.href = "../home/home.html";
}

function logout() {
    firebase.auth().signOut().then(() => {
        sessionStorage.clear();
        window.location.href = "../login/login.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}