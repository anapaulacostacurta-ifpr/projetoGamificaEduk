const boardgamesService = {
    save: (logboardgames, boardgameid) => {
        return firebase.firestore()
            .collection("logboardgames")
            .doc(boardgameid)
            .set(logboardgames);
    }
};