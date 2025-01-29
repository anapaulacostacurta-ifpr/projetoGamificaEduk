const logboardgamesService = {
    save: (user_UID, logboardgames) => {
        return firebase.firestore()
            .collection("logboardgames")
            .doc(user_UID)
            .set(logboardgames);
    },
    getlogboardgameByUserUID: async (user_UID,boardgame_id,level,data) => {
        const querySnapshot = await firebase.firestore().collection("boardgames").doc(user_UID)
        .where('boardgame_id','==',boardgame_id)
        .where('level','==',level)
        .where('data','==',data)
        .get();
        console.log(querySnapshot);

        if(querySnapshot.empty){
            throw new Error("Nenhum resposta registrada ainda.");
        }
        const logboardgame = querySnapshot.docs.map(doc=>doc.data());
        console.log(logboardgame);
        return logboardgame;
},
};