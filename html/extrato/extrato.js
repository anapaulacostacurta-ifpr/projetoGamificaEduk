firebase.auth().onAuthStateChanged( (user) => {
    if (user) {
        sessionStorage.setItem("userUid", user.uid);
        window.location.href = "../home/home.html";
    }else{
        sessionStorage.clear;
        window.location.href = "../login/login.html";
    }
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
    }).catch(error => {
        console.log(getErrorMessage(error));
    });
})

const user_UID = sessionStorage.userUid;
//Ranking Geral
const scorePoint = document.getElementById("score_total");
scorePoint.innerHTML = "Score Total: "+sessionStorage.getItem("score_total");

// Captura o evento de envio do formulário
document.getElementById("extrato-form").addEventListener("submit", function(event) {
    event.preventDefault();
 // Captura os dados do formulário
 const select = document.getElementById("level");
 const level = select.options[select.selectedIndex].value;
 const extrato = document.querySelector(".card-extrato");
 let linhas = ''; 

 logboardgamesService.getLogboardgameByUserUID(user_UID,level).then(logboardgames => {
    logboardgames.forEach(logboardgame => {
        let data_hora = '<td><span>'+ logboardgame.data+'-</span>'+'<span>'+logboardgame.hora+'</span></td>';
        let boardgame_id = '<td><span>'+logboardgame.boardgame_id+'</span></td>';
        let quiz = '<td><span>'+logboardgame.category+'-</span>'+'<span>'+logboardgame.quiz_numb+'-</span>'+'<span>'+logboardgame.user_answer+'</span></td>';
        let score_old = '<td><span>'+logboardgame.score_old+'</span></td>';
        let score_round = '<td><span>'+logboardgame.score_round+'</span></td>';
        let tokenid = '<td><span>'+logboardgame.tokenid;+'</span></td>';
        linhas = linhas +'<tr>'+data_hora+boardgame_id+quiz+score_old+score_round+tokenid+'</tr>';
    });
    let tbody = '<tbody>'+linhas+'</tbody>';
    let thead = '<thead><tr><th>Data/Hota</th><th>Tabuleiro</th><th>Quiz</th><th>Pontuação anterior</th><th>Pontuação nova</th><th>Token</th></tr></thead>';     
    let table = '<table class="table table-bordered">'+ thead + tbody+'</table>';
    extrato.innerHTML = table;
}).catch((error) => {
    let errorString = '<span>'+ error+'<span>';
    extrato.innerHTML = errorString;
});
});