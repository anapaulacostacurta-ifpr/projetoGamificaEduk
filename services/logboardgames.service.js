const logboardgamesService = {
    save: (user_UID, logboardgames) => {
        return firebase.firestore()
            .collection("logboardgames")
            .doc(user_UID)
            .set(logboardgames);
    },
    getlogboardgameByUserUID: async (user_UID) => {
        const querySnapshot = await firebase.firestore().collection("logboardgames")
        .doc(user_UID);
        console.log(querySnapshot);
        alert("Consulta ok!");

        if(querySnapshot.empty){
            console.log("Log vazia:" + user_UID);
            alert("Vazio");
            return [];
        }
        const logboardgames = querySnapshot.docs.map(doc=>doc.data());
        console.log(logboardgames);
        alert("Retornando!");
        return logboardgames;
    },
};