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
        try {
            const querySnapshot = await firebase.firestore().collection("boardgames")
            .where('boardgameid','==',boardgameid)
            .get();
            console.log(querySnapshot);

            if(querySnapshot.empty){
                throw new Error("Tabuleiro não encontrador:" + boardgameid);
            }
            const boardgame = querySnapshot.docs.map(doc=>doc.data());
            console.log(boardgame);
            return boardgame;
        } catch (error) {
                console.error("Erro ao carregar perguntas:", error);
                alert("Falha ao carregar perguntas. Tente novamente mais tarde.");
                return [];
        }
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
            .add(boardgames);
    },
    update: boardgames => {
        return firebase.firestore()
            .collection("boardgames")
            .doc(boardgames.uid)
            .update(boardgames);
    },
    addPlayers:  async (boardgameid, player) => {
        return firebase.firestore()
            .collection("boardgames")
            .doc(boardgameid)
            .arrayUnion(player)
    },
    updatePlayer: (boardgameid, player) => {
        try {
            return firebase.firestore()
            .collection("boardgames")
            .doc(boardgameid)
            .update(player)

        } catch(e) {
            console.log('Error: ', e);
        }
    }
};