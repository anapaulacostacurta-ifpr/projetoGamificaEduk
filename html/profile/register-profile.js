const professores = document.getElementById("professores");
userService.getTeachers().then( (teachers) =>{
    let select = `<select id="teachers" name="teachers" class="form-select-sm">`;
    teachers.forEach(teacher => {
        select = select +`<option value="${teacher.uid}" selected>"${teacher.name}"</option>`;
    });
    select = select + `</select>`; 
    professores.innerHTML = select;
});

firebase.auth().onAuthStateChanged((User) => {
    if (!User) {
        window.location.href = "../login/login.html";
    }else{
        var avatar = "avatar1";
        var state = false; // insere desativado
        
        document.getElementById("profile-form").addEventListener("submit", function(event) {
            event.preventDefault();
            // Captura os dados do formulário
            let profile_options = document.getElementById("profile");
            var profile = profile_options.options[profile_options.selectedIndex].value;
            let professor_options = document.getElementById("teachers");
            var professor = professor_options.options[professor_options.selectedIndex].value;
            let name = document.getElementById("name").value;
            let nickname = document.getElementById("nickname").value;
            
            const users = {
                name, 
                nickname, 
                profile, 
                professor,
                avatar,
                state,
            }

            userService.save(User.uid,users);
        });
    }
});

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../login/login.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}

function voltar(){
    window.location.href = "home.html";
}




