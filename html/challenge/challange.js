var question;
var activity;
var tokenid;
var user_UID;
var activity_uid;
var question_uid;
var qrcode; // receperá da leturá do usuário
var ground_control_point_id;
var ground_control_point_next;
var pos_ground_control_point;
var orienteering_id; //  getControlPoint() irá popular
var group_id; //getControlPoint()  irá popular 

firebase.auth().onAuthStateChanged((User) => {
  const riddle_box = document.getElementById("riddle_box");
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
        let correct_path = getControlPoint(qrcode);
        if(correct_path){
          question = getAtualChallange();
          if(!(question === "")){
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
        }else{
          //QRCode Inválido!
        }
      })

      function showOrienteering(){
        let que_tag = `<span class="fw-bold">${question.text}</span>`;
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
          option[i].setAttribute("onclick", "optionSelectedOrienteering(this)");
        }
      }

      function showRiddle(riddle){
        let que_tag = `<span class="">${riddle.text}</span>`;
        let attention = `<span class="">${riddle.text}</span>`;
        let location = `<span class="">${riddle.location}</span>`;
        riddle_box.innerHTML = `${que_tag}${attention}${location}`;      
      }

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

      async function getControlPoint(qrcode) {
        let next_pc;
        let answered_control_point = [];
      
        try {
          const log_activities = await logActivityService.getAtivitityByChallange(activity_uid, user_UID, "challange");
          if (log_activities.length > 0) {
            // Já existem pontos respondidos
            // Monta lista de pontos já respondidos
            orienteering_id = log[0].group_id;
            log_activities.forEach(log => {
              answered_control_point.push({
                qrcode: log.ground_control_point_id,
                pos_point: log.pos_ground_control_point,
                next_point: log.ground_control_point_next,
              });
            });
            const orienteering = await orienteeringService.getOrienteeringByUid(orienteering_id);
            const pathway = orienteering.pathway;
            const pos_qrcode = pathway.indexOf(qrcode);
      
            if (pos_qrcode === -1) {
              console.log("QRCode inválido: não pertence ao percurso.");
              return false;
            }else{
              let ord_answered = parseInt(answered_control_point.length)-1;
              const last_pc = parseInt(answered_control_point[ord_answered].pos_point);
              if(pos_qrcode == (last_pc + 1)){
                const next_pc = answered_control_point[ord_answered].next_point;
                let qrcode_pathway = pathway[pos_qrcode];
                if (qrcode_pathway === qrcode){
                  if((qrcode === next_pc)){
                    ground_control_point_id = qrcode;
                    pos_ground_control_point = pos_qrcode;
                    ground_control_point_next = pathway[pos_qrcode+1];
                    console.log("✅ QRCode válido e na sequência correta.");
                    return true;
                  }else{
                    console.log("CORRIGIR: Houve Erro de Registro");
                    return false;
                  }
                }else{
                  console.log("❌ QRCode fora da sequência esperada.");
                  return false;
                }
              }else{
                if (pos_qrcode < expected_next_position) {
                  console.log("⚠️ Este QRCode já foi utilizado.");
                  return false;
                } else {
                  console.log("❌ QRCode fora da sequência esperada.");
                  return false;
                }
              }
            }

          } else {
            // Nenhum ponto respondido ainda — inicia o percurso
            orienteering_id = qrcode;
            const orienteering = await orienteeringService.getOrienteeringByUid(orienteering_id);
            const pathway = orienteering.pathway;
            group_id = orienteering.group_id;
            ground_control_point_next = pathway[0];
            pos_ground_control_point = "";
            console.log("✅ Primeiro ponto de controle correto.");
            return true;
            //console.log("❌ Primeiro QRCode inválido. Início incorreto.");
            //return false;
          }     
        } catch (error) {
          console.error("Erro ao verificar ponto de controle:", error);
          return false;
        }
      }
    

      async function getAtualChallange() {
        let atual_challange = null;
        let answered_challange = [];
      
        try {
          // Obtem todas as atividades (questões) da atividade principal
          const activityTasks = await activityTaskService.getTaskActivity(activity_uid);
      
          for (const activityTask of activityTasks) {
            // Para cada atividade, carrega os desafios (challenges)
            const challanges = await challangeService.getChallangesByUid(activityTask.dados.challanges_id);
      
            for (const challange of challanges) {
              // Verifica os logs do usuário para ver o que já foi respondido
              const log_activities = await logActivityService.getAtivitityByChallange(activity_uid, user_UID, "challange");
      
              if (log_activities.length > 0) {
                // Se houver questões respondidas, salva quais foram
                group_id = log_activities[0].group_id;
                log_activities.forEach(log_activity => {
                  answered_challange.push({
                    question: log_activity.question_uid,
                    pos_point: log.pos_ground_control_point,
                  });
                });
      
                // Pega a lista de questões do desafio atual
                const questions = challange.questions;
                // Determina qual a próxima questão a ser respondida
                for (let i = 0; i < questions.length; i++) {
                    let questionId = questions[i];
                    if (answered_challange.indexOf(questionId) == -1){ //Se encontrado foi respondida. Senão retorna -1 (Não encontrado).
                      const question_find = await questionsService.findByUid(questionId);
                      if (question_find != null) {
                          atual_challange = question_find;
                          break; // retorna a primeira não respondida
                      }
                    }else{
                      //Respondida
                    }
                }
                return atual_challange;
              } else {
                // Se nenhuma questão foi respondida, retorna apenas o enigma (riddle) inicial
                const riddles = await riddleService.getRiddleByGroundControlPointId(orienteering_id, group_id);
                if (riddles.length > 0) {
                  let riddle = riddles[0]; // Apenas o primeiro enigma
                  setLogActivityRiddle(riddle.uid);
                  showRiddle(riddle.dados);
                  return "";
                }
              }
            }
          
          
          }
          // Caso não encontre nenhum desafio ou enigma
          return null;
        
        } catch (error) {
          console.error("Erro ao buscar o desafio atual:", error);
          return null;
        }
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
      
      //if user clicked on optionSelectedOrienteering
      function optionSelectedOrienteering(answer) {
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
        let riddle = getNextRiddle();
        setLogActivityOrienteering(correct, riddle.uid);
        if(correct){
          alert("Você Acerto! Parabens! Agora Fique atento ao Enigma para achar o próximo ponto!" );
        }else{
          alert("Que pena, você não acertou! Mas fique atento ao Enigma para achar o próximo ponto!" );
        }
        showRiddle(riddle.dados);
      }

     async function getNextRiddle(){
        let atual_riddle = null;
        const riddles = await riddleService.getRiddleByGroundControlPointId(orienteering_id, group_id);
        if (riddles.length > 0) {
          atual_riddle = riddles[0]; // Apenas o primeiro enigma
          first_QRCode = true;
        }
        return atual_riddle;
    }
      
      function setLogActivityRiddle(riddle_id){
        const time = (new Date()).toLocaleTimeString('pt-BR');
        const data = (new Date()).toLocaleDateString('pt-BR');
        let category = "challange";
        let type = "orienteering";
        let ground_control_point_id = qrcode; // ponto atual
        let group_id = orienteering_id; // orienteering_id
        let tokenid = qrcode;// orienteering_id
        let level = activity.level;

        var log_activities ={
          activity_uid,
          category, //quiz
          type, // {puzzle ou orienteering}`
          ground_control_point_id, // if orienteering para verificar o ponto de control passado
          pos_ground_control_point, // Ponto inicial
          ground_control_point_next, // proximo ponto de controle 
          group_id,
          data,
          time,
          level, 
          question_uid, //riddle_id
          riddle_id,
          tokenid,
          user_UID
        };
        //gravar na Log as resposta selecionadas
        logActivityService.save(log_activities);
      } 

      function setLogActivityOrienteering(riddle_id){
        const time = (new Date()).toLocaleTimeString('pt-BR');
        const data = (new Date()).toLocaleDateString('pt-BR');
        let category = "challange";
        let type = "orienteering";
        let tokenid = qrcode;// orienteering_id
        let level = activity.level;

        var log_activities ={
          activity_uid,
          category, //quiz
          type, // {puzzle ou orienteering}`
          ground_control_point_id, // if orienteering para verificar o ponto de control passado
          pos_ground_control_point, // Ponto inicial
          ground_control_point_next, // proximo ponto de controle 
          group_id,
          data,
          time,
          level, 
          question_uid, //riddle_id
          riddle_id,
          tokenid,
          user_UID
        };
        //gravar na Log as resposta selecionadas
        logActivityService.save(log_activities);
      } 
  }
})

function voltar(){
  window.location.href = "../play/menu.html?activity_uid="+activity_uid;
}



