const logboardgamesService = {
    save: (user_UID, logboardgames) => {
        return firebase.firestore()
            .collection("logboardgames")
            .doc(boardgameid)
            .set(logboardgames);
    },
    getBoardGameByID: async (user_UID) => {
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
};