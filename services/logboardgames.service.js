const logboardgamesService = {
    save: (user_UID, logboardgames) => {
        return firebase.firestore()
            .collection("logboardgames")
            .doc(user_UID)
            .set(logboardgames);
    },
    getlogboardgameByUserUID: async (user_UID,boardgame_id,level,data) => {
        const querySnapshot = await firebase.firestore().collection("logboardgames")
        .where('log_answers.user_UID','==', user_UID)
        .where('log_answers.boardgame_id','==',boardgame_id)
        .where('log_answers.level','==',level)
        .where('log_answers.data','==',data)
        .get();
        console.log(querySnapshot);

        if(querySnapshot.empty){
            throw new Error("Log vazia:" + user_UID +","+boardgame_id+","+level+","+data);
        }
        const logboardgame = querySnapshot.docs.map(doc=>doc.data());
        console.log(logboardgame);
        return logboardgame;
    },
};