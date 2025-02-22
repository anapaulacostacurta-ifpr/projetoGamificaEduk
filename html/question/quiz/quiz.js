firebase.auth().onAuthStateChanged((User) => {
  const question_box = document.getElementById("question_box");
  const que_text = document.getElementById("que_text");
  const option_list = document.getElementById("option_list");
  const timeText = document.getElementById("time_left_txt");
  const timeCount = document.getElementById("timer_sec");
  var activity;
  var question;
  var quizzes;
  var player;
  var question;
  var activity_uid;
  var tokenid;
  if (!User) {
      window.location.href = "../login/login.html";
  }else{
    userService.findByUid(User.uid).then(user=>{
      //document.getElementById("nameUser").innerHTML = user.nickname;
      var avatar = user.avatar;
      //document.getElementById("avatarUser").innerHTML ='<img class="img-fluid rounded-circle img-thumbnail" src="../../assets/img/perfil/'+avatar+'.png" width="50" height="50"></img>';
      const params = new URLSearchParams(window.location.search);
      activity_uid = params.get('activity_uid');
      tokenid = params.get('tokenid');
      boardgamesService.getActivitybyUid(activity_uid).then((activityfind) => {
        activity = activityfind;
        var players = activityfind.players;
        player = players.find(player => player.user_UID == User.uid);
        //Buscas as Questões a serem respondidas para a atividade de acorco com o nive e categoria.
        questionsService.getQuizzesByLevel(activity_uid,parseInt(activity.level),"quiz").then(questions =>{
          quizzes = questions;
        });
        // Verifica quais questões já foram respondidas pelo jogador
        question = getAtualQuiz();
        //Verifica se o jogador já respondeu todas as perguntas
        if(question == null){
          alert("Não existe nenhum quiz para ser respondido!");
          window.location.href = "../../play/menu.html";
        }else{
          showQuestion();
          startTimer(30);
        }
      });
    });
    
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
        for (i = 0; i < allOptions; i++) {
          if (option_list.children[i].textContent == correcAns) {
            //if there is an option which is matched to an array answer
            option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
            option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
            console.log("Auto selected correct answer.");
          }
        }
      }
      for (i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
      }
      setScore(correct, userAns);
    }

    function setScore(corret, userAns){
      let tmp_players = activity.players;
      let score_old;
      let score;
      let players = [];
      var last = tmp_players.length;
      let timestamp = new Date().getTime();
      for(i=0;i<last;i++){
        score_old = tmp_players[i].score;
        if(tmp_players[i].user_UID == User.uid){
          //Atualizar os quizzes respondidos
          let quiz_answered = setQuizAnswered(tmp_players[i].quiz_answered,question.numb);
          //Atualizar score
          if (corret){
            score = score_old + 10;
          }else{
            score = score_old - 5;
          }
          let tokens_quiz_used =  setTokensQuizUsed(tmp_players[i].tokens_quiz_used); 
          players[i] = {user_UID:tmp_players[i].user_UID,score:score,ckeckin_date: tmp_players[i].ckeckin_date,ckeckin_time: tmp_players[i].ckeckin_time, timestamp: timestamp,quiz_answered,tokens_quiz_used};
        }else{
          let quiz_answered = setQuizAnswered(tmp_players[i].quiz_answered);
          let tokens_quiz_used =  setTokensQuizUsed(tmp_players[i].tokens_quiz_used); 
          players[i] = {user_UID:tmp_players[i].user_UID,score:score,ckeckin_date: tmp_players[i].ckeckin_date,ckeckin_time: tmp_players[i].ckeckin_time, timestamp: tmp_players[i].timestamp,quiz_answered,tokens_quiz_used};
        }
      }
      //Gravar Dados
      boardgamesService.update(activity_uid, {players});

      //gravar na Log as resposta selecionadas
      const hora = (new Date()).toLocaleDateString('pt-BR');
      const data = (new Date()).toLocaleDateString('pt-BR');
      const log_answers = {user_UID: User.uid, data: data, hora: hora, level:activity.level, activity_uid: activity_uid, activity_id: activity.id, category: question.category, question_numb:question.numb, user_answer:userAns, score_old: score_old, score_new: score, tokenid: tokenid};
      // Salvar no banco de dados.
      logboardgamesService.save(log_answers);
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

    function getAtualQuiz(){
      let atual_quiz;
      let answered_quizzes = player.quiz_answered;
      if(!(quizzes === undefined)){
        quizzes.forEach(quiz => {
          if(answered_quizzes.indexOf(quiz.numb) == -1){ //Não foi respondida
            atual_quiz = quiz;
          }
        });
      }
      return atual_quiz;
    }
  }

  function setQuizAnswered(atual_quiz_answered){
    let quiz_answered = new Array();
    let stop = atual_quiz_answered.length;
    for (i=0; i<stop;i++){
        quiz_answered[i] = atual_quiz_answered[i];
    }
    return quiz_answered;
  }

  function setTokensQuizUsed(atual_tokens_quiz_used){
    let tokens_quiz_used = new Array();
    let stop = atual_tokens_quiz_used.length;
    for (i=0; i<stop;i++){
        tokens_quiz_used[i] = atual_tokens_quiz_used[i];
    }
    return tokens_quiz_used;
  }

  function setQuizAnswered(atual_quiz_answered, question_numb){
    let quiz_answered = new Array();
    let stop = atual_quiz_answered.length;
    for (i=0; i<stop;i++){
        quiz_answered[i] = atual_quiz_answered[i];
    }
    quiz_answered[stop] = question_numb;
    return quiz_answered;
  }


})

function fechar(){
  window.location.href = "../../play/menu.html";
}