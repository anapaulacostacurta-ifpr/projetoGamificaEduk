const logboardgamesService = {
    save: (user_UID, data, logboardgames) => {
        return firebase.firestore()
            .collection("logboardgames")
            .doc(user_UID)
            .doc(data)
            .set(logboardgames);
    },
    getlogboardgameByUserUID: async (user_UID,boardgame_id,level,data) => {
        const querySnapshot = await firebase.firestore().collection("logboardgames").
        .doc(user_UID)
        
        if(querySnapshot.empty){
            console.log("Log vazia:" + user_UID +","+boardgame_id+","+level+","+data);
            return [];
        }
        const logboardgames = querySnapshot.docs.map(doc=>doc.data());
        logboardgames.forEach(logboardgame => {
            var log_answers = logboardgame.log_answers;
            if(log_answers.user_UID == user_UID){
              if (log_answers.boardgame_id == boardgame_id){
                if(log_answers.level == level){
                    if(log_answers.data == data){
                        return log_answers;
                    }
                }
              }
            }
        });   
        console.log("Log vazia:" + user_UID +","+boardgame_id+","+level+","+data);
        return [];
    },
};