const boardgameService = {
    findByUid: uid => {
        return firebase.firestore()
            .collection("boardgame")
            .doc(uid)
            .get()
            .then(doc => {
                return doc.data();
            });
    },
    remove: boardgame => {
        return firebase.firestore()
            .collection("boardgame")
            .doc(boardgame.uid)
            .delete();
    },
    save: boardgame => {
        return firebase.firestore()
            .collection("boardgame")
            .add(boardgame);
    },
    update: question => {
        return firebase.firestore()
            .collection("boargame")
            .doc(boardgame.uid)
            .update(boardgame);
    }
};