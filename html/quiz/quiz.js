const quiz_box = document.querySelector(".quiz_box");
const que_text = document.querySelector(".que_text");
const option_list = document.querySelector(".option_list");

//Ranking Nível
const scoreLevelPoint = document.getElementById("score_round");
scoreLevelPoint.innerHTML = "Level Score: "+sessionStorage.getItem("score_round");

const level = document.getElementById("level");
level.innerHTML = "Nível: "+sessionStorage.getItem("level");

//Ranking Geral
const scorePoint = document.getElementById("score_total");
scorePoint.innerHTML = "Score Total: "+sessionStorage.getItem("score_total");

const category = "quiz";

questionsService.getQuestionsByLevel(level, category).then(questions =>{

  //Verificar o que o usuário já respondeu
    questions.forEach(question => {
      showQuestion(question);
    });
  });


function showQuestion(question){
  //creating a new span and div tag for question and option and passing the value using array index
  let que_tag = "<span>" + question.numb +".</span>"+"<span>" + question.text +"</span>";
  let option_tag = '';
  for (i=0; i<question.options.length; i++){
    option_tag = option_tag + '<div class="option"><p class="choice-text" data-number="'+i+'"><span class="question">'+question.options[i]+"</span></p></div>";
  }
  que_text.innerHTML = que_tag; //adding new span tag inside que_tag
  option_list.innerHTML = option_tag; //adding new div tag inside option_tag

  const option = option_list.querySelectorAll(".option");
  // set onclick attribute to all available options
  for (i = 0; i < option.length; i++) {
    option[i].setAttribute("onclick", "optionSelected(this)");
  }

}

//if user clicked on option
function optionSelected(answer) {
  clearInterval(counter); //clear counter
  clearInterval(counterLine); //clear counterLine
  let userAns = answer.querySelector(".choice-text").textContent; //getting user selected option
  let correcAns = questions[que_count].answer; //getting correct answer from array
  const allOptions = option_list.children.length; //getting all option items

  if (userAns == correcAns) {
    //if user selected option is equal to array's correct answer
    userScore += 1; //upgrading score value with 1
    scoreTextPoint.innerHTML = userScore * 10;
    answer.classList.add("correct"); //adding green color to correct selected option
    answer.insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to correct selected option
    console.log("Correct Answer");
    console.log("Your correct answers = " + userScore);
  } else {
    answer.classList.add("incorrect"); //adding red color to correct selected option
    answer.insertAdjacentHTML("beforeend", crossIconTag); //adding cross icon to correct selected option
    console.log("Wrong Answer");

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
  next_btn.classList.add("show"); //show the next button if user selected any option
}


function saveAnswer(){
  if(quizzes.empety){
  quizzes = new Array();
  quizzes[0] = {numb:1,option:1,token:"a",data:""};
  questionsService.addQuizzes(boardgame_id, {quizzes});
  }else{
    players.push({numb:1,option:1,token:"a",data:""});
  }
}