

const riddle_text = document.getElementById("riddle_text");
const riddle_attention = document.getElementById("riddle_attention");
const riddle_location = document.getElementById("riddle_location");
const btn_voltar_tag = document.getElementById("btn_voltar");
var activity_id;
firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    var user_UID; 
    var group_id; // ground_control_point_id vinculdado ao riddle_id
    var ground_control_point_id; // Será populado na função validaQRCode()
    var ground_control_point_next; //Será populado na função validaQRCode()
    var pos_ground_control_point; //Será populado na função validaQRCode()
    var player2_uid; 
    user_UID = User.uid; 
    const params = new URLSearchParams(window.location.search);
    activity_id = params.get('activity_id'); 
    first_point = params.get('first_point');
    first_point = (first_point === "true") ? true : false;
    let level, points;
    activityService.getActivitybyUid(activity_id).then(activity =>{
      if(validarValor(activity)){
        level = activity.level;
      } 
      checkinactivityService.getcheckinbyPlayer(activity_id,user_UID).then(checkin_ativities =>{
        if(validarValor(checkin_ativities)){
          points = checkin_ativities[0].dados.points;
        }
      })  
    })
    btn_voltar_tag.innerHTML = `<button type="button" class="badge bg-success p-2" onclick="voltar()">OK</button>`; 
    if(first_point){
      ground_control_point_id = params.get('ground_control_point_id'); //OK
      pos_ground_control_point = params.get('pos_ground_control_point');
      ground_control_point_next = params.get('ground_control_point_next');
      group_id = params.get('group_id');
      player2_uid = params.get('player2_uid');
      riddleService.getRiddleByGroundControlPointId(ground_control_point_next.trim(), group_id.trim()).then(riddles =>{
        showRiddle(riddles[0].dados);
        if(validarValor(level)){
          console.log(level);
        }
        setLogFirstQRCode(riddles[0].uid, activity_id, level, points, user_UID, player2_uid);
        setLogFirstQRCode(riddles[0].uid, activity_id, level, points, player2_uid, user_UID);
      })
    }else{
      const riddle_id = params.get('riddle_id');
        riddleService.getRiddleByUID(riddle_id).then(riddle =>{
          if(validarValor(riddle)){
            showRiddle(riddle);
          }else{
            alert("Problema para carregar a dica!");
          }
      })   
    }

    function validarValor(valor) {
      if (valor === null) {
        return false;
      }
      return true;
    }

  function showRiddle(riddle){
      let riddle_text_tag = `<span class="riddle_text"><img src="../../assets/images/key.png" width="30" height="30">${riddle.text}</span>`;
      let riddle_attention_tag = `<span class="riddle_attention"><img src="../../assets/images/alert.png" width="30" height="30"><strong>Mas atenção:</strong>${riddle.attention}</span>`;
      let riddle_location_tag = `<span class="riddle_location"><img src="../../assets/images/location.png" width="30" height="30">${riddle.location}</span>`;
      riddle_text.innerHTML = `${riddle_text_tag}`;   
      riddle_attention.innerHTML = `${riddle_attention_tag}`;  
      riddle_location.innerHTML = `${riddle_location_tag}`;     
  }

    function setLogFirstQRCode(riddle_id, activity_id, level, points, user_uid, player2_uid){
      const time = (new Date()).toLocaleTimeString('pt-BR');
      const data = (new Date()).toLocaleDateString('pt-BR');
      let category = "challenge";
      let type = "orienteering";
      let tokenid = group_id;// 
      //let level = activity.level;
      let question_id = "";
      let points_new = points;
      let points_old = points;
      let user_UID = user_uid;
      let group_user = player2_uid;

      var log_activities ={
        activity_id,
        category, 
        type, 
        ground_control_point_id, // if orienteering para verificar o ponto de control passado
        pos_ground_control_point, // Ponto inicial
        ground_control_point_next, // proximo ponto de controle 
        group_id,
        data,
        time,
        level, 
        points_new, 
        points_old,
        question_id, 
        riddle_id,
        tokenid,
        group_user,
        user_UID
      };

      //gravar na Log as resposta selecionadas
      logActivityService.save(log_activities);
    
    }    
  }
})

function voltar(){
  window.location.href = `../menu/menu.html?activity_id=${activity_id}`;
}