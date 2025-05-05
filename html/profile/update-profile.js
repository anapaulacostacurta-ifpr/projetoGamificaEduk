const list_host = document.getElementById("list_hosts");
list_host.style.display = "none";
var alert_sucesso = document.getElementById("alert_sucesso");
var alert_error = document.getElementById("alert_error");
var msg_sucesso = document.getElementById("res_sucesso");
var msg_error = document.getElementById("res_error");  

firebase.auth().onAuthStateChanged((User) => {
    if (User){
        document.getElementById("profile-form").addEventListener("submit", function(event) {
            event.preventDefault();
            var avatar = "avatar1";
            let profile_options = document.getElementById("profile");
            var profile = profile_options.options[profile_options.selectedIndex].value;
            let hosts_options = document.getElementById("hosts");
            var host = "";
            if(profile === "player"){
                host = hosts_options.options[hosts_options.selectedIndex].value;
            }
            let name = document.getElementById("name").value;
            let nickname = document.getElementById("nickname").value;
            let uid = User.uid;
            let coins = 0;
            var user = {uid, name, nickname, host, profile, avatar, coins};
            userService.update(uid, user);
            
            let profile_update = uid;
            let profile_name = name;
            let new_date = new Date();
            let date_update = new_date.toLocaleDateString('pt-BR');
            let time_update = new_date.toLocaleTimeString('pt-BR');
            let profile_state = state;
            let type = "update";

            const log_profile = {type, profile_update, profile_name, date_update,time_update, profile_state};
            logprofileService.save(log_profile);
            msg_sucesso.innerHTML= "Cadastrado atualizado com sucesso! Aguarde seu perfil ser ativado pelo Anfitrião do Evento.";
            alert_sucesso.classList.add("show");
        })
    }
});

function onChangePerfil(){
    let profile_options = document.getElementById("profile");
    var profile = profile_options.options[profile_options.selectedIndex].value;
    if(profile === "player"){
        list_host.style.display = "block";
        popularSelectHosts();
    }else{
        list_host.style.display = "none";
    }
}

function popularSelectHosts() {
    let Hosts = document.getElementById("hosts");
    userService.getHosts().then(hosts=>{
        hosts.forEach(host => {
        Hosts.innerHTML = Hosts.innerHTML +`<option value="${host.uid}">${host.name}</option>`;
        });
    });
}

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../login/login.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}

function voltar(){
    window.location.href = "../home.html";
}

function buscarAvatar(){
    const lista_avatars = document.getElementById("lista_avatars");
    let linha_id = '<td><span>'+'<label class="form-check-label" for="'+1+'">'+'<img class="img-fluid rounded-circle img-thumbnail" src="../../assets/img/perfil/'+avatar1+'.png" width="50" height="50"></img>'+'</span></label></td>';
    let radio = '<td><input type="radio" class="form-check-activate" id="avatar_id" name="avatar_id" value="'+avatar1+'" checked"></td>';
    linhas = linhas + '<tr>'+radio+linha_id+'</tr>';  
    linha_id = '<td><span>'+'<label class="form-check-label" for="'+2+'">'+'<img class="img-fluid rounded-circle img-thumbnail" src="../../assets/img/perfil/'+avatar2+'.png" width="50" height="50"></img>'+'</span></label></td>';
    radio = '<td><input type="radio" class="form-check-activate" id="avatar_id" name="avatar_id" value="'+avatar2+'" checked"></td>';
    linhas = linhas + '<tr>'+radio+linha_id+'</tr>';  
    let tbody = '<tbody>'+linhas+'</tbody>';
    let thead = '<thead><tr><th></th><th>Atividade</th><th>Level</th><th>Inicio</th><th>Fim</th><th>Status</th></tr></thead>';     
    let table = '<table class="table table-hover" align="center">'+ thead + tbody+'</table>';
    lista_avatars.innerHTML = table;
}






