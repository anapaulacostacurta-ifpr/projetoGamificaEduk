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
    getBoardGameByID: async (boardgameid,round_date, host, level) => {
        const querySnapshot = await firebase.firestore().collection("boardgames")
        .where('boardgameid','==',boardgameid)
        .where('round_date','==',round_date)
        .where('host','==',host)
        .where('level','==',level)
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
    save: (boardgames) => {
        return firebase.firestore()
            .collection("boardgames")
            .doc()
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