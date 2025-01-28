const boardgamesService = {
    findAll: () => {
        return firebase.firestore()
        .collection("boardgames")
        .get()
        .then(doc => {
            return doc.data();
        });
    },
    findByUid: uid => {
        return firebase.firestore()
            .collection("boardgames")
            .doc(uid)
            .get()
            .then(doc => {
                return doc.data();
            });
    },
    getBoardGameByID: async (boardgameid) => {
            const querySnapshot = await firebase.firestore().collection("boardgames")
            .where('boardgameid','==',boardgameid)
            .where('state','==','started')
            .where('round_date','==',(new Date()).toLocaleDateString('pt-BR'))
            .get();
            console.log(querySnapshot);

            if(querySnapshot.empty){
                throw new Error("Tabuleiro não encontrador:" + boardgameid);
            }
            const boardgame = querySnapshot.docs.map(doc=>doc.data());
            console.log(boardgame);
            return boardgame;
    },
    remove: boardgames => {
        return firebase.firestore()
            .collection("boardgames")
            .doc(boardgames.uid)
            .delete();
    },
    save: (boardgames, boardgameid) => {
        return firebase.firestore()
            .collection("boardgames")
            .doc(boardgameid)
            .set(boardgames);
    },
    update: boardgames => {
        return firebase.firestore()
            .collection("boardgames")
            .doc(boardgameid)
            .update(boardgames);
    },
    addPlayers:  (boardgameid, players) => {
        return firebase.firestore()
            .collection("boardgames")
            .doc(boardgameid)
            .update(players);
            
    }
};