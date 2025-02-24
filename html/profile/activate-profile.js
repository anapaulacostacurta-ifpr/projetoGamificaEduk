firebase.auth().onAuthStateChanged((User) => {
    if (!User) {
        window.location.href = "../login/login.html";
    }else{
        const lista_alunos = document.getElementById("lista_alunos");
        var alert_sucesso = document.getElementById("alert_sucesso");
        var alert_error = document.getElementById("alert_error");
        var msg_sucesso = document.getElementById("res_sucesso");
        var msg_error = document.getElementById("res_error");  
        
        userService.getPlayersInative(User.uid).then(players =>{
            let linhas=``;
            players.forEach(player => {
                let aluno = `<td><span><label class="form-check-label" for="${player.uid}">${player.name}-${player.uid}</label></span></td>`;
                let radio = `<td><input type="radio" class="form-check-activate aluno" id="${player.uid} name="aluno" value="${player.uid}"></td>`;
                linhas = linhas + `<tr>${radio}${aluno}</tr>`;
             })
            let tbody = `<tbody>${linhas}</tbody>`;
            let thead = `<thead><tr><th></th><th>Aluno</th></tr></thead>`;     
            let table = `<table class="table table-hover" align="center">${thead}${tbody}</table>`;
            lista_alunos.innerHTML = table;

            document.getElementById("profile-form").addEventListener("submit", function(event) {
                    event.preventDefault();
                    // Captura os dados do formulário
                    var aluno_uid; 
                    var aluno_radio = document.querySelectorAll('input[type="radio"]');
                    for (i = 0; i < aluno_radio.length; i++) {
                        if (aluno_radio[i].checked){
                            aluno_uid =aluno_radio[i].value;
                        }
                    }
                    var users = {state: true};
                    var profile_approver = User.uid;
                    var data_aprovacao = (new Date()).toLocaleDateString('pt-BR');
                    var hora_aprovacao = (new Date()).toLocaleTimeString('pt-BR');
                    var profile_activated = aluno_uid;
                    const log_profile = {profile_approver, data_aprovacao, hora_aprovacao, profile_activated};
                    
                    //Realiza a ativação do usuário
                    userService.update(aluno_uid,users);

                    //Grava logo da aprocação e ativação do usuário
                    logprofileService.save(log_profile);

                    msg_sucesso.innerHTML= "Perfil ativado com sucesso!";
                    alert_sucesso.classList.add("show");
                    document.getElementById("ativar").disabled = true;
            });
            
        }).catch(error => {
            if(error.message === "01 - Não encontrado."){
                msg_error.innerHTML= 'Nenhum aluno para ativação.';
                alert_error.classList.add("show");
                document.getElementById("ativar").disabled = true;
            }
            console.log(error);
        });
    }
});





