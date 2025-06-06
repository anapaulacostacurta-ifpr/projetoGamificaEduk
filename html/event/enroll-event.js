// event-enroll.js

/**
 * Script responsável por validar e processar a inscrição do jogador em um evento.
 * Utiliza Firebase Auth para autenticação, Firestore para verificação do evento e
 * serviços customizados para inscrição.
 */

const form = {
    confirmIdEvent: () => document.getElementById('event_id'),
    idEventRequiredError: () => document.getElementById('id-event-required-error'),
    enrollButton: () => document.getElementById('bt-success')
}

// Seletores de elementos de feedback
const alertSuccess = document.getElementById("alert_sucesso");
const alertError = document.getElementById("alert_error");
form.idEventRequiredError().style.display = "none";
disableButton(true);

document.addEventListener("DOMContentLoaded", () => {
    // Verifica autenticação
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        // Redireciona para login se não houver sessão
        window.location.href = `${location.origin}/projetoGamificaEduk/html/login/login.html`;
        return;
      }

      // Busca dados do usuário autenticado
      userService.findByUid(user.uid).then(userData => {
          const isHost = userData.host;
          const profile = userData.profile;

          if (profile !== "player") {
            showError("Sem permissão de acesso à funcionalidade!");
            return;
          }
          
          // Adiciona ouvinte ao formulário
          const form = document.getElementById("enroll-form");
          form.addEventListener("submit", async event => {
            event.preventDefault();
            
            const inputId = document.getElementById("event_id").value;
            const userUID = user.uid;

            // INÍCIO da medição de tempo
            const inicio = performance.now();

            // Consulta Evento por ID no Firebase
            eventService.getEventsByID(inputId).then(events =>{
              // FIM da medição de tempo
              const fim = performance.now();
              const message = `Tempo de busca dos eventos: ${(fim - inicio).toFixed(2)} ms`;
              console.log(message);
              if (!(validarValor(events))){
                showError("Evento não encontrado!");
                return;
              }

              let foundEvent = events.find(ev => ev.dados.id === inputId);

              if (!foundEvent) {
                showError("Evento não encontrado!");
                return;
              }

              const dados = foundEvent.dados;

              if (dados.state !== "started") {
                showError("Evento não está ativo!");
                return;
              }

              if (dados.host !== isHost) {
                showError("Evento de outro Anfitrião!");
                return;
              }

              if (!isWithinDeadline(dados)) {
                showError("Evento fora do prazo!");
                return;
              }
              
              //Consulta os Eventos por UID que por UserUID que já foi realizado inscrição.
              enrollEventService.getEnrollsByEventUidUserUid(foundEvent.uid, userUID).then (enrolls => {

                if (enrolls.length > 0) {
                  showError("Inscrição já foi realizada para este evento!");
                  return;
                }

                // Monta objeto de inscrição
                const now = new Date();
                const newEnroll = {
                  user_UID: userUID,
                  coins: 0,
                  date: now.toLocaleDateString("pt-BR"),
                  time: now.toLocaleTimeString("pt-BR"),
                  event_id: foundEvent.uid
                };

                //Realiza a Inscrição no Evento
                enrollEventService.save(newEnroll);

                //Mensagem de Sucesso de Inscrição no Evento
                showSuccess("Inscrição no evento realizada com sucesso!");
              });  
            }).catch ( error => {
              console.error("Erro durante a inscrição:", error);
              showError("Erro inesperado ao processar a inscrição.");
            })
          });
        }).catch(() => {
          showError("Erro ao carregar os dados do usuário.");
        });
    });
});

/**
 * Verifica se a data atual está dentro do prazo do evento.
 * @param {Object} event - Dados do evento com campos de data e hora.
 * @returns {boolean}
 */
function isWithinDeadline(event) {
  const now = new Date();

  const [dStart, tStart] = [event.date_start.split("/"), event.time_start.split(":")];
  const [dEnd, tEnd] = [event.date_final.split("/"), event.time_final.split(":")];

  const startDate = new Date(dStart[2], dStart[1] - 1, dStart[0], tStart[0], tStart[1]);
  const endDate = new Date(dEnd[2], dEnd[1] - 1, dEnd[0], tEnd[0], tEnd[1]);

  return now >= startDate && now <= endDate;
}

/**
 * Exibe mensagem de erro formatada.
 * @param {string} message - Texto de erro a exibir.
 */
function showError(message) {
  alertError.classList.add("show");
  alertError.classList.add("alert-dismissible");
  alertError.innerHTML = `
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    <strong>${message}</strong>
  `;
}

function validarValor(valor) {
  if (valor === null) {
    return false;
  }
  return true;
}

/**
 * Exibe mensagem de sucesso formatada.
 * @param {string} message - Texto de sucesso a exibir.
 */
function showSuccess(message) {
  alertSuccess.classList.add("show");
  alertSuccess.classList.add("alert-dismissible");
  alertSuccess.innerHTML = `
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    <strong>${message}</strong>
  `;
}

function onChangeIdEvent(){
  const idEvent = form.confirmIdEvent().value.trim();
  form.idEventRequiredError().style.display = idEvent ? "none" : "block";
  if (!idEvent) {
    disableButton(true);
  }else{
    disableButton(false);
  }
}

function disableButton(value){
  form.enrollButton().disabled = value;
}


