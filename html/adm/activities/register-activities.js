const list_hosts = document.getElementById("list_hosts");
  userService.getHosts().then(hosts=>{
      const select = `<select id="hosts" name="hosts" class="form-control form-control-sm">`;
      hosts.forEach(host => {
          select = select +`<option value="${host.uid}" selected>"${host.name}"</option>`;
      });
      select = select + `</select>`; 
      list_hosts.innerHTML = select;
});


firebase.auth().onAuthStateChanged((User) => {
  if (!User) {
      window.location.href = "../login/login.html";
  }else{

    document.getElementById("activity-form").addEventListener("submit", function(event) {
        event.preventDefault();
       
        var alert_sucesso = document.getElementById("alert_sucesso");
        var alert_error = document.getElementById("alert_error");
        var msg_sucesso = document.getElementById("res_sucesso");
        var msg_error = document.getElementById("res_error");  
      
        // Captura os dados do formulário
        const date_start = new Date((document.getElementById("activity_date_start").value).replace("-","/")).toLocaleDateString('pt-BR');
        const date_final = new Date((document.getElementById("activity_date_final").value).replace("-","/")).toLocaleDateString('pt-BR');
        const time_start = document.getElementById("activity_time_start").value;
        const name = document.getElementById("activity_name").value;
        const time_final = document.getElementById("activity_time_final").value;
        const level = document.getElementById("activity_level").value;
        const hosts_options = document.getElementById("hosts");
        const host = hosts_options.options[hosts_options.selectedIndex].value;
        const players = [];
        const id = document.getElementById("activity_id").value;
        const state = "waiting"; // "waiting", "started", "finished"
      
        // Cria o objeto para salvar o quiz
        const newactivity = {
          date_start,
          date_final,
          time_start,
          time_final,
          players,
          id,
          name,
          level,
          host,
          state,  
        };
        try{
          activityService.save(newactivity);
          msg_sucesso.innerHTML= "Atividade cadastrada com Sucesso!";
          alert_sucesso.classList.add("show");
          document.getElementById("bt-success").disabled = true;
        } catch (error){
          msg_error.innerHTML= error;
          alert_error.classList.add("show");
        }
    });
  }
})
