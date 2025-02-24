document.getElementById('profile').addEventListener('change', function () {
    var style = this.value == "aluno" ? 'block' : 'none';
    document.getElementById('professores').style.display = style;

    const professores = document.getElementById("professores");
    userService.getTeachers().then( (teachers) =>{
        let select = `<select id="teachers" name="teachers" class="form-select-sm">`;
        teachers.forEach(teacher => {
            select = select +`<option value="${teacher.uid}" selected>"${teacher.name}"</option>`;
        });
        select = select + `</select>`; 
        professores.innerHTML = select;
    });
});

firebase.auth().onAuthStateChanged((User) => {
    if (!User) {
        window.location.href = "../login/login.html";
    }else{
        var alert_sucesso = document.getElementById("alert_sucesso");
        var alert_error = document.getElementById("alert_error");
        var msg_sucesso = document.getElementById("res_sucesso");
        var msg_error = document.getElementById("res_error");  
        userService.findByUid(User.uid).then(user =>{
            if(user === undefined){
              //Usuário não está cadastrado, tem que ser atualizado perfil
              document.getElementById("profile-form").addEventListener("submit", function(event) {
                    event.preventDefault();
                    // Captura os dados do formulário
                    var avatar = "avatar1";
                    var state = false; // insere desativado
                    let profile_options = document.getElementById("profile");
                    var profile = profile_options.options[profile_options.selectedIndex].value;
                    let professor_options = document.getElementById("teachers");
                    var professor = professor_options.options[professor_options.selectedIndex].value;
                    let name = document.getElementById("name").value;
                    let nickname = document.getElementById("nickname").value;
                    let uid = User.uid;
                    
                    const users = {
                        name, 
                        nickname, 
                        profile, 
                        professor,
                        avatar,
                        state,
                        uid,
                    }
                    userService.save(User.uid,users);
                    msg_sucesso.innerHTML= "Cadastrado atualizado com sucesso! Aguarde seu perfil ser ativado pelo professor.";
                    alert_sucesso.classList.add("show");
                    document.getElementById("salvar").disabled = true;
                });
            }else{
                console.log('usuário já cadastrado:'+User.uid+'-'+user.name);
                msg_error.innerHTML= 'Usuário já cadastrado:'+User.uid+'-'+user.name;
                alert_error.classList.add("show");
                document.getElementById("salvar").disabled = true;
            }
        })
    }
});






