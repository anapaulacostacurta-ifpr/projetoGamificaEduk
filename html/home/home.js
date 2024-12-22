function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../index.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}

function newQuestion() {
    window.location.href = "../questions/questions.html";
}

// Buscar todos os documentos da coleção
function showQuestions(){
    questionsRef.get().then(snapshot => {
        // Iterar sobre os documentos
            snapshot.forEach(doc => {
            // Obter os dados do documento
            const questionData = doc.data();
            // Fazer algo com os dados, por exemplo, exibir no console
            console.log(questionData);
             });    
            }).catch(error => {
            console.error("Erro ao buscar os dados:", error);
            });
}
