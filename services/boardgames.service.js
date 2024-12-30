const boardgamesService = {
    findByUid: uid => {
        return firebase.firestore()
            .collection("boardgames")
            .doc(uid)
            .get()
            .then(doc => {
                return doc.data();
            });
    },
    remove: boardgames => {
        return firebase.firestore()
            .collection("boardgames")
            .doc(boardgames.uid)
            .delete();
    },
    save: boardgames => {
        return firebase.firestore()
            .collection("boardgames")
            .add(boardgames);
    },
    update: boardgames => {
        return firebase.firestore()
            .collection("boardgames")
            .doc(boardgames.uid)
            .update(boardgames);
    }
};