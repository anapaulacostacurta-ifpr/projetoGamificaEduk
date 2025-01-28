const logboardgamesService = {
    save: (boardgameid, logboardgames) => {
        return firebase.firestore()
            .collection("logboardgames")
            .doc(boardgameid)
            .set(logboardgames);
    }
};