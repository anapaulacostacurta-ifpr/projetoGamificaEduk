var question;
var activity;
var tokenid;
var user_UID;
var activity_uid;
var question_uid;
var qrcode; // receperá da leturá do usuário
var first_QRCode = false; // É o primeiro QRCode?
var ground_control_point_id;
var orienteering_id; //  getControlPoint() irá popular
var group_id; //getControlPoint()  irá popular 

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
        let correct_path = getControlPoint(qrcode);
        if(correct_path){
          question = getAtualChallange();
          if(first_QRCode){
            showRiddle();
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
        }else{
          //QRCode Inválido!
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

      async function getControlPoint(qrcode) {
        let atual_pc;
        let answered_control_point = [];
      
        try {
          const log_activities = await logActivityService.getAtivitityByChallange(activity_uid, user_UID, "challange");
      
          if (log_activities.length > 0) {
            // Já existem pontos respondidos
            const orienteering = await orienteeringService.getOrienteeringByUid(orienteering_id);
            const pathway = orienteering.pathway;
            const pos_qrcode = pathway.indexOf(qrcode);
      
            if (pos_qrcode === -1) {
              console.log("QRCode inválido: não pertence ao percurso.");
              return false;
            }
      
            // Monta lista de pontos já respondidos
            log_activities.forEach(log => {
              answered_control_point.push({
                qrcode: log.ground_control_point_id,
                pos_point: log.pos_control_point
              });
            });
      
            // Validação dos pontos anteriores
            for (let i = 0; i < answered_control_point.length; i++) {
              const answered = answered_control_point[i];
              const expected_qrcode = pathway[answered.pos_point];
      
              if (answered.qrcode === expected_qrcode) {
                console.log(`✅ ${answered.qrcode} - Posição ${answered.pos_point}: OK`);
              } else {
                console.log(`❌ ${answered.qrcode} - Posição ${answered.pos_point}: Fora da ordem esperada`);
              }
            }
      
            // Verifica se o QRCode atual está na próxima posição esperada
            const ultimo_ponto = answered_control_point[answered_control_point.length - 1];
            const expected_next_position = ultimo_ponto.pos_point + 1;
      
            if (pos_qrcode === expected_next_position) {
              console.log("✅ QRCode válido e na sequência correta.");
              return true;
            } else if (pos_qrcode < expected_next_position) {
              console.log("⚠️ Este QRCode já foi utilizado.");
            } else {
              console.log("❌ QRCode fora da sequência esperada.");
            }
      
          } else {
            // Nenhum ponto respondido ainda — inicia o percurso
            const orienteering = await orienteeringService.getOrienteeringByUid(qrcode);
            const pathway = orienteering.pathway;
            orienteering_id = qrcode;
            group_id = orienteering.group_id;
            atual_pc = pathway[0];
      
            if (qrcode === atual_pc) {
              console.log("✅ Primeiro ponto de controle correto.");
              return true;
            } else {
              console.log("❌ Primeiro QRCode inválido. Início incorreto.");
              return false;
            }
          }
      
        } catch (error) {
          console.error("Erro ao verificar ponto de controle:", error);
          return false;
        }
      }
      
      function getCP(qrcode){
        let atual_pc; // considerar que não tem nenhum respondido
        let answered_control_point;
        //o Jogador irá ler o QRCODE que o professor irá fornecer em salada de Aula é o que irá indicar o caminho
        logActivityService.getAtivitityByChallange(activity_uid, user_UID, "challange").then(log_activities =>{
          if(log_activities.length > 0){
            //qrcode="VeazSC7vCR9LZVxuIhDY";// Ponto 2
            orienteeringService.getOrienteeringByUid(orienteering_id).then(orienteering =>{
              let pathway = orienteering.pathway;
              let pos_qrcode = pathway.indexOf(qrcode);
              if(pos_qrcode > -1) { // Se encontrado foi Existe no pathway. retorna -1 não encontrado não é válido.
                log_activities.forEach(log_activity =>{
                  let qrcode = log_activity.ground_control_point_id;
                  let pos_point = log_activity.pos_control_point;
                  let pc = {qrcode,pos_point}
                  answered_control_point.push(pc);
                })
                let stop = answered_control_point.length;
                for (i=0;i<stop;i++){
                  let pos = answered_control_point[i].pos_point;
                  let qrcode = answered_control_point[i].qrcode;
                  if (pos<pos_qrcode){
                    // Se a posição for menor que a do QRCode
                    if(pathway[pos]===qrcode){
                      console.log(`${qrcode} - ${pos} - OK`);  
                    }else{
                      console.log(`${qrcode} - ${pos} - NOK`);
                    }
                  }else{
                    //Não é para ter registro ainda
                    console.log(`${pos} - ${pos} NOK`);
                  }
                }
                let pos_previos = answered_control_point[stop-1].pos_point;
                let qrcode_previous = answered_control_point[stop-1].qrcode;
                if(qrcode_previous === pathway[pos_qrcode-1]){
                  
                }
              }
            })
          }else{ //primeiro ponto de controle
            //qrcode= "vJZRYcUycl3UzLyyPioM";
            orienteering_id = qrcode;
            orienteeringService.getOrienteeringByUid(orienteering_id).then(orienteering =>{
              let pathway = orienteering.pathway;
              group_id = orienteering.group_id; // uid do pathway
              atual_pc = pathway[0]; // primeiro QRCode do do enigma que indica o ponto de controle
              return atual_pc;
            })
          }
        })
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
                log_activities.forEach(log_activity => {
                  answered_challange.push({
                    question: log_activity.question_uid,
                    point: log_activity.pos_control_point
                  });
                });
      
                // Pega a lista de questões do desafio atual
                const questions = challange.questions;
      
                // Determina qual a próxima questão a ser respondida
                for (let i = 0; i < questions.length; i++) {
                  const questionId = questions[i];
                  const alreadyAnswered = answered_challange.some(answer => answer.question === questionId);
                  if (!alreadyAnswered) {
                    const question_find = await questionsService.findByUid(questionId);
                    if (question_find != null) {
                        atual_challange = question_find;
                        break; // retorna a primeira não respondida
                    }
                  }
                }
                return atual_challange;
      
              } else {
                // Se nenhuma questão foi respondida, retorna apenas o enigma (riddle) inicial
                const riddles = await riddleService.getRiddleByGroundControlPointId(orienteering_id, group_id);
      
                if (riddles.length > 0) {
                  atual_challange = riddles[0]; // Apenas o primeiro enigma
                  first_QRCode = true;
                  return atual_challange;
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

      function getAC(){
        let atual_challange;
        let answered_challange;
        activityTaskService.getTaskActivity(activity_uid).then(activityTasks => {
          activityTasks.forEach(activityTask => {
            challangeService.getChallangesByUid(activityTask.dados.challanges_id).then(challanges =>{
              challanges.forEach(challange =>{
                logActivityService.getAtivitityByChallange(activity_uid, user_UID, "challange").then(log_activities =>{
                  if(log_activities.length > 0){
                      log_activities.forEach(log_activity =>{
                        let question = log_activity.question_uid;
                        let point = log_activity.pos_control_point;
                        let dados = {question,point};
                        answered_challange.push(dados);
                      })
                      let questions = challange.questions;
                      return atual_challange;
                      }else{
                        //Não resposndeu nenhuma pergunta apresentar a diga do primeiro ponto.
                        riddleService.getRiddleByGroundControlPointId(orienteering_id, group_id).then(riddles =>{
                          riddles.forEach(riddle =>{
                            question = riddle;
                          })
                        })
                      }
                    })
                  })
                })
              })
            })
        return [];
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
          pos_control_point, // posição do ponto de controle 
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



