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

        if(querySnapshot.empty){
            console.log("Log vazia:" + user_UID);
            return [];
        }
        const logboardgames = querySnapshot.docs.map(doc=>doc.data());
        return logboardgames;
    },
};