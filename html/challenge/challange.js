var question;
var activity;
var tokenid;
var user_UID;
var activity_uid;
var question_uid;
var qrcode;
var orienteering_id;

firebase.auth().onAuthStateChanged((User) => {
  const question_box = document.getElementById("question_box");
  const que_text = document.getElementById("que_text");
  const option_list = document.getElementById("option_list");
  const timeText = document.getElementById("time_left_txt");
  const timeCount = document.getElementById("timer_sec");

  if (User) {
      user_UID = User.uid;
      const params = new URLSearchParams(window.location.search);
      activity_uid = params.get('activity_uid');
      tokenid = params.get('tokenid');
      qrcode = params.get('qrcode');
      activityService.getActivitybyUid(activity_uid).then((activityfind) => {
        activity = activityfind.dados;
        //Verificar se o QRcode lido é o correto do caminho
        ground_control_point_id =getControlPoint(qrcode);
        // Se retornou vazio é porque o QRcode não é Valido
        if (ground_control_point_id ===""){
          //QRCode Valido Buscar a questão que deve respoder.
          question_uid = getAtualChallange();
            questionsService.findByUid(question_uid).then(question_find =>{
              question = question_find;
              //Verifica se o jogador já respondeu todas as perguntas
              if(question == null){
                alert("Não existe nenhum desafio para ser respondido!");
                voltar();
              }else{
                if (question.type === "orienteering"){
                    showOrienteering();
                }else{
                  if (question.type === "puzzle"){
                    showPuzzle();
                    startTimer(30);
                  }else{
                    showQuestion();
                    startTimer(30);
                  }
                }
              }
            });
        }else{
          alert("QRCode lido não é o Correto para o seu caminho!");
          voltar();
        }
      })

      function showQuestion(){
        let que_tag = '<span class="fw-bold">' +  question.numb +".</span>"+'<span class="fw-bold">' +  question.text +"</span>";
        let option_tag = 
        '<div class="option"><span class="choice-prefix m-2 p-2">A</span><span class="choice-text card m-2 p-2" style="width:380px" data-number="1"><span class="question">' +
          question.options[0] +
          "</span></span></div>"+
          '<div class="option"><span class="choice-prefix m-2 p-2">B</span><span class="choice-text card m-2 p-2" style="width:380px" data-number="2"><span class="question">' +
          question.options[1] +
          "</span></span></div>" +
          '<div class="option"><span class="choice-prefix m-2 p-2">C</span><span class="choice-text card m-2 p-2" style="width:380px" data-number="3"><span class="question">' +
          question.options[2] +
          "</span></span></div>" +
          '<div class="option"><span class="choice-prefix m-2 p-2">D</span><span class="choice-text card m-2 p-2" style="width:380px" data-number="4"><span class="question">' +
          question.options[3] +
          "</span></span></div>";
        
        que_text.innerHTML = que_tag; //adding new span tag inside que_tag
        option_list.innerHTML = option_tag; //adding new div tag inside option_tag
      
        const option = option_list.querySelectorAll(".option");
        // set onclick attribute to all available options
        for (i = 0; i < option.length; i++) {
          option[i].setAttribute("onclick", "optionSelected(this)");
        }
      }
      
      function startTimer(time) {
        counter = setInterval(timer, 1000);
        function timer() {
          timeCount.textContent = time; //changing the value of timeCount with time value
          time--; //decrement the time value
          if (time < 9) {
            //if timer is less than 9
            let addZero = timeCount.textContent;
            timeCount.textContent = "0" + addZero; //add a 0 before time value
          }
          if (time < 0) {
            //if timer is less than 0
            clearInterval(counter); //clear counter
            timeText.textContent = "Tempo Restante"; //change the time text to time off
            const allOptions = option_list.children.length; //getting all option items
            let correcAns = sessionStorage.answer; //getting correct answer from array
            for (i = 0; i < allOptions; i++) {
              if (option_list.children[i].textContent == correcAns) {
                //if there is an option which is matched to an array answer
                option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
                option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
                console.log("Time Off: Auto selected correct answer.");
              }
            }
            for (i = 0; i < allOptions; i++) {
              option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
            }
          }
        }
      }
      function getControlPoint(qrcode){
        let ground_control_point_passed;
        activityTaskService.getTaskActivity(activity_uid).then(activityTasks => {
          activityTasks.forEach(activityTask => {
            challangeService.getChallangesByUid(activityTask.dados.challanges_id).then(challanges =>{
              log_activities.forEach(log_activity =>{
                if(log_activity.category === "challange"){
                  ground_control_point_passed.push(log_activity.ground_control_point_id);
                }
              })
              challanges.forEach(challange =>{
                orienteering_id = challange.orienteering_id;
                orienteeringService.getOrienteeringByUid(orienteering_id).then(orienteering =>{
                  let pathway = orienteering.pathway; // ground_control_point_id
                  let pos_path = pathway.indexOf(qrcode); //posição do ponto de controle no array
                  let last_pc = ground_control_point_passed.length-1 ;
                  let pc = ground_control_point_passed[last_pc];
                  let path_anterior = pathway[pos_path-1];
                  if(pc == path_anterior){
                    // path está correto
                    return qrcode;
                  }else{
                    //Code lido Não é o correto.
                    return "";
                  }
                })
              })
            })
          })
        })
      }

      function getAtualChallange(){
        let atual_challange;
        let answered_challange;
        let ground_control_point_passed;
        logActivityService.getAtivitityByUserUID(activity_uid, user_UID).then(log_activities =>{
          activityTaskService.getTaskActivity(activity_uid).then(activityTasks => {
            activityTasks.forEach(activityTask => {
              challangeService.getChallangesByUid(activityTask.dados.challanges_id).then(challanges =>{
                log_activities.forEach(log_activity =>{
                  if(log_activity.category === "challange"){
                    let question = log_activity.question_uid;
                    answered_challange.push(question);
                    ground_control_point_passed.push(log_activity.ground_control_point_id);
                  }
                })
                challanges.forEach(challange =>{
                  orienteering_id = challange.orienteering_id;
                  orienteeringService.getOrienteeringByUid(orienteering_id).then(orienteering =>{
                    let pathway = orienteering.pathway; // ground_control_point_id
                    let questions = challange.questions;
                    for (i=0; i<pathway.length;i++){
                      if(ground_control_point_passed.indexOf(pathway[i]) == -1){
                      
                      }else{
                        
                      }
                      if(ground_control_point_passed.indexOf(path)>-1){ //Se encontrado passado pelo ponto de controle. Retorna -1 não encontrado.
                        questions.forEach(question =>{
                          if (answered_challange.indexOf(question) == -1){ //Se encontrado foi respondida. retorna -1 Não encontrado.
                            atual_challange = question;
                            return atual_challange;
                          }
                        })
                      }
                    })
                  })
                })
              })
            })
          })
        return atual_challange;
      }
      
      // creating the new div tags which for icons
      let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
      let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';
      
      //if user clicked on option
      function optionSelected(answer) {
        let userAns = answer.querySelector(".choice-text").textContent; //getting user selected option
        let correct;
        const allOptions = option_list.children.length; //getting all option items
        if (userAns == question.answer[0]) {
          answer.classList.add("correct"); //adding green color to correct selected option
          answer.insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to correct selected option
          correct = true;
        } else {
          answer.classList.add("incorrect"); //adding red color to correct selected option
          answer.insertAdjacentHTML("beforeend", crossIconTag); //adding cross icon to correct selected option
          console.log("Wrong Answer");
          correct = false;
        }
        
        for (i = 0; i < allOptions; i++) {
          if (option_list.children[i].textContent == question.answer[0]) {
            //if there is an option which is matched to an array answer
            option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
            option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
            console.log("Auto selected correct answer.");
          }
        }
        for (i = 0; i < allOptions; i++) {
          option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
        }
        setPoints(correct, userAns);// Resposta correta e resposta marcada pelo jogador.
      }
      
      function setPoints(corret,  user_answer){
        let points_old = points;
        let points_new;
        let level = activity.level;
        let category =  question.category;
        let type = question.type;
        const time = (new Date()).toLocaleTimeString('pt-BR');
        const data = (new Date()).toLocaleDateString('pt-BR');
      
        //Atualizar points
        if (corret){
          points_new = points_old + question.points;
        }else{
          points_new = points_old - question.lose_points;
        }

        var log_activities ={
          activity_uid,
          category, //quiz
          type, // {puzzle ou orienteering}`
          ground_control_point_id, // if orienteering para verificar o ponto de control passado
          data,
          time,
          level, 
          question_uid,
          points_new,
          points_old,
          tokenid,
          user_UID,
          user_answer
        };
        //gravar na Log as resposta selecionadas
        logActivityService.save(log_activities);
      } 
  }
})

function voltar(){
  window.location.href = "../play/menu.html?activity_uid="+activity_uid;
}



