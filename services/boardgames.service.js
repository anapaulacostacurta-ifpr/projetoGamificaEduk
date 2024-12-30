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
    },
    addPlayers:  async (boardgameid, player) => {
        return firebase.firestore()
            .collection("boardgames")
            .doc(boardgameid)
            .arrayUnion(player)
    },
    updatePlayer: async (boardgameid, player) => {
        
        const docRef = firebase.firestore()
        .collection("boardgames")
        .doc(boardgameid);
      
        const res = await docRef.update(player);      
        console.log('Update: ', res);
    }
};