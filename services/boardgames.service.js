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
    getBoardGameByID: async (boardgameid) => {
        try {
            const querySnapshot = await firebase.firestore().collection("boardgames")
            .where('boardgamesid','==',boardgameid)
            .get();

            if(querySnapshot.empty){
                throw new Error("Nenhuma pergunta encontrada para o nível "+ level+ " .");
            }
            const boardgame = querySnapshot.docs.map(doc=>doc.data());
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
    }
};