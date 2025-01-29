const logboardgamesService = {
    save: (log_answers) => {
        return firebase.firestore()
            .collection("logboardgames")
            .doc()
            .set(log_answers);
    },
    getlogboardgameByUserUID: (user_UID) => {
        const querySnapshot = firebase.firestore().collection("logboardgames")
        .doc(user_UID);

        if(querySnapshot.empty){
            throw new Error("Nenhuma log encontrada para o usuario "+ user_UID+ " .");
        }
        const logboardgames = querySnapshot.docs.map(doc=>doc.data());
        return logboardgames;
    },
};