var question;
var user_UID; //OK
var activity_uid; //OK
var qrcode; // receperá da leiturá do usuário //OK
var group_id; // ground_control_point_id vinculdado ao riddle_id
var ground_control_point_id; // Será populado na função validaQRCode()
var ground_control_point_next; //Será populado na função validaQRCode()
var pos_ground_control_point; //Será populado na função validaQRCode()
var points;

const que_text = document.getElementById("que_text");
const option_list = document.getElementById("option_list");
const timeText = document.getElementById("time_left_txt");
const timeCount = document.getElementById("timer_sec");

firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    user_UID = User.uid; //OK
    const params = new URLSearchParams(window.location.search);
    activity_uid = params.get('activity_uid'); //OK
    qrcode = params.get('qrcode'); //OK
    try{
      let correct_path = verificaQRcode(qrcode);
      if(correct_path){
        setLogQRCode(qrcode, true);
        question = getAtualChallange();
        if(!(question === "")){
          showOrienteering();
          startTimer(30);
        }
      }else{
        setLogQRCode(qrcode, false);
      }
    }catch (error){
      alert("Erro ao buscar dados:", error);
    }

    async function verificaQRcode(qrcode) {
      try {
        const answeredControlPoints = getLogAtivities(activity_uid, user_UID, "challange");
        // Caso o jogador já tenha respondido pontos
        if (answeredControlPoints.length > 0) {
          group_id = answeredControlPoints[0].group_id;
          const pathway = getOrienteeringData(group_id);
          if(pathway.length > 0){
            const currentQRIndex = pathway.indexOf(qrcode);
            if (currentQRIndex === -1) {
              alert("QRCode inválido: não pertence ao percurso.");
              return false;
            }
            const lastAnsweredIndex = answeredControlPoints.length - 1;
            const lastPointPosition = parseInt(answeredControlPoints[lastAnsweredIndex].pos_point);
            const expectedNextPosition = lastPointPosition + 1;

            if (currentQRIndex === expectedNextPosition) {
              const expectedNextQR = answeredControlPoints[lastAnsweredIndex].next_point;
              if (qrcode === expectedNextQR) {
                // Atualiza controle de posição
                ground_control_point_id = qrcode;
                pos_ground_control_point = currentQRIndex;
                ground_control_point_next = pathway[currentQRIndex + 1];
                alert("QRCode válido e na sequência correta.");
                return true;
              } else {
                alert("QRCode fora da sequência esperada.");
                return false;
              }
            } else if (currentQRIndex < expectedNextPosition) {
              alert("Este QRCode já foi utilizado.");
              return false;
            } else {
              alert("QRCode fora da sequência esperada.");
              return false;
            }
          }else{
            alert("Erro ao verificar ponto de control e buscar o PathWay.");
            return false;
          }
        } else {
          // Nenhum ponto foi respondido — tentativa de início
          group_id = qrcode;
          const pathway = getOrienteeringData(qrcode);
          if (pathway.length > 0) {
            // Atualiza controle de início
            ground_control_point_id = qrcode;
            ground_control_point_next = pathway[0];
            pos_ground_control_point = -1; // Primeiro ponto, sem posição anterior

            alert("Primeiro QRCode válido.");
            return true;
          } else {
            alert("Primeiro QRCode inválido. Início incorreto.");
            return false;
          }
        }
      } catch (error) {
        alert("Erro ao buscar dados:", error);
        throw error;
      }
    }

    async function getOrienteeringData(groupId) {
      try {
        const orienteering = await orienteeringService.getOrienteeringByGroupId(groupId);

        if (orienteering && orienteering.pathway && orienteering.pathway.length > 0) {
          return orienteering.pathway;
        }
        return []
      } catch (error) {
        console.error("Erro ao buscar dados de orienteering:", error);
        return [];
      }
    }

    async function getLogAtivities(activity_uid, user_UID, type){
      try {
        const logs = await logActivityService.getAtivitityByChallange(activity_uid, user_UID, type);
        
        if (!logs || logs.length === 0) {
          return [];
        }

        // Mapeia os logs para extrair apenas os campos relevantes
        return logs.map(log => ({
          qrcode: log.ground_control_point_id,
          pos_point: log.pos_ground_control_point,
          next_point: log.ground_control_point_next,
          group_id: log.group_id,
        }));

      } catch (error) {
        console.error("Erro ao obter atividades do log:", error);
        return [];
      }
    }

    async function getAtualChallange() {
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
                });
              });

              for (const questionId of challange.questions) {
                if (!answered_challange.includes(questionId)) {
                  const question = await questionsService.findByUid(questionId);
                  if (question) {
                    return question; // Primeira questão ainda não respondida
                  }
                }
              }

            } else {
              // Se nenhuma questão foi respondida, retorna apenas o enigma (riddle) inicial
              //Direcionar para riddle.html
              window.location.href = `./riddle.html?activity_uid=${activity_uid}&first_point=${true}&ground_control_point_id=${ground_control_point_id}&group_id=${group_id}&pos_ground_control_point=${-1}&ground_control_point_next=${ground_control_point_next}`;
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
      option[i].setAttribute("onclick", "optionSelected(this)");
    }
  }

  async function getActivity(activity_uid) {
    return activity = await activityService.getActivitybyUid(activity_uid);
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

  // creating the new div tags which for icons
  let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
  let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

  //if user clicked on optionSelectedOrienteering
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
      let next_riddle = getNextRiddle();
      setLogActivityOrienteering(correct, next_riddle.uid);
      if(correct){
        alert("Você Acertou! Parabens! Agora Fique atento ao Enigma para achar o próximo ponto!" );
      }else{
        alert("Que pena, você não acertou! Mas fique atento ao Enigma para achar o próximo ponto!" );
      }
      //showRiddle(riddle.dados);
      window.location.href = `./riddle.html?activity_uid=${activity_uid}&first_point=${false}&riddle_id=${riddle.uid}`;
    }

    async function getNextRiddle(ground_control_point_next){
      let next_riddle = null;
      const riddles = await riddleService.getRiddleByGroundControlPointId(ground_control_point_next, group_id);
      if (riddles.length == 1) {
        atual_riddle = riddles[0]; 
      }else{
        alert("problema no cadastro dos enigmas. Verificar com o administrador do evento!")
      }
      return next_riddle;
    }

    async function checkin_ativities(activity_uid, user_UID) {
      const checkin_ativities = await checkinactivityService.getcheckinbyPlayer(activity_uid,user_UID);
        checkin_ativities.forEach(checkin_ativity =>{
          points = checkin_ativity.dados.points;
        })
        return checkin_ativities;
    }

    function setLogActivityOrienteering(correct, riddle_id){
      let points_old = 0;
      let points_new = 0;
      const time = (new Date()).toLocaleTimeString('pt-BR');
      const data = (new Date()).toLocaleDateString('pt-BR');
      let category = "challange";
      let type = "orienteering";
      let tokenid = qrcode;// 
      let activity = getActivity(activity_uid); //OK
      let level = activity.level;
      checkin_ativities(activity_uid,user_UID);

      points_old = points;
      if(correct){
        points_new = points + questions.points;
      }else{
        points_new = points - questions.lose_points;
      }
      
      var log_activities ={
        activity_uid,
        category,
        type, 
        ground_control_point_id, // if orienteering para verificar o ponto de control passado
        pos_ground_control_point, // Ponto inicial
        ground_control_point_next, // proximo ponto de controle 
        group_id,
        data,
        time,
        level, 
        question_uid,
        points_old,
        points_new, 
        riddle_id,
        tokenid,
        user_UID
      };
      //gravar na Log as resposta selecionadas
      logActivityService.save(log_activities);
    }

    function setLogQRCode(qrcode, correct){
      let points_old = 0;
      let points_new = 0;
      const time = (new Date()).toLocaleTimeString('pt-BR');
      const data = (new Date()).toLocaleDateString('pt-BR');
      let category = "challange";
      let type = "qrcode";
      let tokenid = qrcode;// 
      let activity = getActivity(activity_uid); //OK
      let level = activity.level;
      checkin_ativities(activity_uid,user_UID);

      points_old = points;
      if(correct){
        points_new = points + 10;
      }else{
        points_new = points - 5;
      }

      var log_activities ={
        activity_uid,
        category,
        type, 
        //ground_control_point_id, // if orienteering para verificar o ponto de control passado
        //pos_ground_control_point, // Ponto inicial
        //ground_control_point_next, // proximo ponto de controle 
        group_id,
        data,
        time,
        level, 
        //question_uid,
        points_old,
        points_new, 
        //riddle_id,
        tokenid,
        user_UID
      };
      //gravar na Log as resposta selecionadas
      logActivityService.save(log_activities);
    }


    async function verificaQRcode(qrcode) {
      try {
        const answeredControlPoints = getLogAtivities(activity_uid, user_UID, "challange");
        // Caso o jogador já tenha respondido pontos
        if (answeredControlPoints.length > 0) {
          const groupId = answeredControlPoints[0].group_id;
          const pathway = getOrienteeringData(groupId);
          if(pathway.length > 0){
            const currentQRIndex = pathway.indexOf(qrcode);
            if (currentQRIndex === -1) {
              console.log("QRCode inválido: não pertence ao percurso.");
              return false;
            }

            const lastAnsweredIndex = answeredControlPoints.length - 1;
            const lastPointPosition = parseInt(answeredControlPoints[lastAnsweredIndex].pos_point);
            const expectedNextPosition = lastPointPosition + 1;

            if (currentQRIndex === expectedNextPosition) {
              const expectedNextQR = answeredControlPoints[lastAnsweredIndex].next_point;
              if (qrcode === expectedNextQR) {
                // Atualiza controle de posição
                ground_control_point_id = qrcode;
                pos_ground_control_point = currentQRIndex;
                ground_control_point_next = pathway[currentQRIndex + 1];
                console.log("QRCode válido e na sequência correta.");
                return true;
              } else {
                console.log("QRCode fora da sequência esperada.");
                return false;
              }
            } else if (currentQRIndex < expectedNextPosition) {
              console.log("Este QRCode já foi utilizado.");
              return false;
            } else {
              console.log("QRCode fora da sequência esperada.");
              return false;
            }
          }else{
            console.log("Erro ao verificar ponto de control e buscar o PathWay.");
            return false;
          }
        } else {
          // Nenhum ponto foi respondido — tentativa de início
          const pathway = getOrienteeringData(qrcode);
          if (pathway.length > 0) {
            // Atualiza controle de início
            group_id = qrcode;
            ground_control_point_id = qrcode;
            ground_control_point_next = pathway[0];
            pos_ground_control_point = -1; // Primeiro ponto, sem posição anterior
    
            console.log("Primeiro ponto de controle correto.");
            return true;
          } else {
            console.log("Primeiro QRCode inválido. Início incorreto.");
            return false;
          }
        }
      } catch (error) {
        console.error("Erro ao verificar ponto de controle:", error);
        return false;
      }
    }

    async function getOrienteeringData(group_id) {
      try {
        const orienteering = await orienteeringService.getOrienteeringByGroupId(group_id);
    
        if (orienteering && orienteering.pathway && orienteering.pathway.length > 0) {
          return orienteering.pathway;
        }
        return []
      } catch (error) {
        console.error("Erro ao buscar dados de orienteering:", error);
        return [];
      }
    }

    async function getLogAtivities (activity_uid, user_UID, type) {
      try {
        const logs = await logActivityService.getAtivitityByChallange(activity_uid, user_UID, type);
        
        if (!logs || logs.length === 0) {
          return [];
        }

        // Mapeia os logs para extrair apenas os campos relevantes
        return logs.map(log => ({
          qrcode: log.ground_control_point_id,
          pos_point: log.pos_ground_control_point,
          next_point: log.ground_control_point_next,
          group_id: log.group_id,
        }));

      } catch (error) {
        console.error("Erro ao obter atividades do log:", error);
        return [];
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
                });
              });
    
              for (const questionId of challange.questions) {
                if (!answered_challange.includes(questionId)) {
                  const question = await questionsService.findByUid(questionId);
                  if (question) {
                    return question; // Primeira questão ainda não respondida
                  }
                }
              }

            } else {
              // Se nenhuma questão foi respondida, retorna apenas o enigma (riddle) inicial
              //Direcionar para riddle.html
              window.location.href = `.riddle.html?activity_uid=${activity_uid}&first_point=${true}&ground_control_point_id=${ground_control_point_id}&group_id=${group_id}`;
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
}
})


  function voltar(){
    window.location.href = "../play/menu.html?activity_uid="+activity_uid;
  }