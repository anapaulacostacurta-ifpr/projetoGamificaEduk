const list_host = document.getElementById("list_hosts");
list_host.style.display = "none";
var alert_sucesso = document.getElementById("alert_sucesso");
var alert_error = document.getElementById("alert_error");
var msg_sucesso = document.getElementById("res_sucesso");
var msg_error = document.getElementById("res_error");  

firebase.auth().onAuthStateChanged((User) => {
    if (User) {
        document.getElementById("profile-form").addEventListener("submit", function(event) {
            event.preventDefault();
            // Captura os dados do formulário
            var avatar = "avatar1";
            var state = false; // insere desativado
            let profile_options = document.getElementById("profile");
            var profile = profile_options.options[profile_options.selectedIndex].value;
            let hosts_options = document.getElementById("hosts");
            var host = hosts_options.options[hosts_options.selectedIndex].value;
            let name = document.getElementById("name").value;
            let nickname = document.getElementById("nickname").value;
            let uid = User.uid;
            
            const users = {
                name, 
                nickname, 
                profile, 
                host,
                avatar,
                state,
                uid,
            }
            
            let profile_register = uid;
            let profile_name = name;
            let date_register = (new Date()).toLocaleDateString('pt-BR');
            let time_register = (new Date()).toLocaleTimeString('pt-BR');
            let host_approver = host;
            let profile_state = state;
            let type = "approver";

            const log_profile = {type, profile_register, profile_name, date_register,time_register, host_approver, profile_state};
            
            userService.save({users});
            logprofileService.save(log_profile);

            msg_sucesso.innerHTML= "Cadastrado atualizado com sucesso! Aguarde seu perfil ser ativado pelo Anfitrião do Evento.";
            alert_sucesso.classList.add("show");
            document.getElementById("save").disabled = true;
        });
    }   
});






