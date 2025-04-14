var question;
var activity;
var tokenid;
var user_UID;
var activity_uid;
var question_uid;
var qrcode;

firebase.auth().onAuthStateChanged((User) => {
  const question_box = document.getElementById("question_box");
  const que_text = document.getElementById("que_text");
  const option_list = document.getElementById("option_list");
  const timeText = document.getElementById("time_left_txt");
  const timeCount = document.getElementById("timer_sec");
  var player;

  if (User) {
      user_UID = User.uid;
      const params = new URLSearchParams(window.location.search);
      activity_uid = params.get('activity_uid');
      tokenid = params.get('tokenid');
      qrcode = params.get('qrcode');
      activityService.getActivitybyUid(activity_uid).then((activityfind) => {
        activity = activityfind.dados;
        playerService.getPlayerByActivity(activity_uid,User.uid).then(players =>{
          var players = activityfind.dados.players;
          players.forEach(t_player => {
            if(t_player.dados.user_UID == User.uid){
                player = t_player;      
            }
          })
          question_uid = getAtualChallange();
          questionsService.findByUid(question_uid).then(question_find =>{
            question = question_find;
            //Verifica se o jogador já respondeu todas as perguntas
            if(question == null){
              alert("Não existe nenhum desafio para ser respondido!");
              window.location.href = "../../play/menu.html?activity_uid="+activity_uid;
            }else{
              if (question.type === "treasure_hunt"){
                  qrcode;
                  showTreasure();
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
        });
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
      
      function getAtualChallange(){
        let atual_challange;
        let answered_challanges = player.dados.challange_answered;
        let challanges_questions = activity.schedule.challange.questions;
        let stop = challanges_questions.length;
        for(i=0;i<stop;i++){
          if (answered_challanges.indexOf(challanges_questions[i]) == -1){ // Não foi respondida
            atual_challange = challanges_questions[i];
            i=stop;
          }
        }
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
        let points_old = player.dados.points;
        let points;
        var log_answers;
      
        //Atualizar os quizzes respondidos gravando o UID da questão.
        let old_challange_answered = player.dados.challange_answered;
        let old_challange_tokens_used = player.dados.challange_tokens_used;
      
        let challange_answered = new Array();
        let last_challange_answered = old_challange_answered.length;
        for (i=0;i<last_challange_answered;i++){
          challange_answered[i] = old_challange_answered[i];
        }
        challange_answered[last_challange_answered] = question_uid;
      
        let challange_tokens_used = new Array();
        let last_challange_tokens_used = old_challange_tokens_used.length;
        for (i=0;i<last_challange_tokens_used;i++){
          challange_tokens_used[i] = old_challange_tokens_used[i];
        }
        challange_tokens_used[last_challange_tokens_used] = tokenid;
      
        //Atualizar points
        if (corret){
          points = points_old + question.points;
        }else{
          points = points_old - question.lose_points;
        }
      
        timestamp = new Date().getTime();
        const hora = (new Date()).toLocaleTimeString('pt-BR');
        const data = (new Date()).toLocaleDateString('pt-BR');
        let level = activity.level;
        let category =  question.category;
        let points_new = points;
      
        const players = {
          points, 
          challange_answered, 
          challange_tokens_used, 
          timestamp,
        }
      
        //Gravar Dados
        playerService.update(player.uid, players);
      
        //gravar na Log as resposta selecionadas
        log_answers = {user_UID, data, hora, level, activity_uid, category, question_uid,  user_answer, points_old, points_new, tokenid};
        logActivityService.save(log_answers);
      }  
  }
})

function fechar(){
  window.location.href = "../../play/menu.html?activity_uid="+activity_uid;
}


